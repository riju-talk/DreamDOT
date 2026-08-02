"use server"

import { prismaUser } from "@/lib/prisma/user";
import { prismaItems } from "@/lib/prisma/items";
import Fuse, { type IFuseOptions } from "fuse.js";

export type SearchResult = {
  type: "profile" | "marketplace";
  id: string;
  title: string;
  description?: string;
  image?: string;
  url: string;
  score?: number;
  metadata?: Record<string, unknown>;
};

// --- alias map: try snake_case and camelCase variants, nested, and common fallbacks
const aliasMap: Record<string, string[]> = {
  username: ["username", "userName", "handle"],
  display_name: ["display_name", "displayName", "displayNameRaw", "name"],
  bio: ["bio", "about", "description"],
  avatar_url: ["avatar_url", "avatarUrl", "avatar"],
  country: ["country", "location", "city"],
  skills: ["skills", "tags"],

  title: ["title", "name"],
  description: ["description", "summary", "body"],
  category: ["category", "type"],
  tags: ["tags", "labels"],
  "creator.username": ["creator.username", "creator.userName", "creatorName", "creator.name"],
};

// Default Fuse getFn — grab nested with dot notation
const fuseDefaultGetFn = (obj: object, path: string | string[]): string | string[] => {
  const parts = Array.isArray(path) ? path : path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (const part of parts) {
    if (current == null) return "";
    current = current[part];
  }
  if (Array.isArray(current)) return current.map(String);
  return current == null ? "" : String(current);
};

// Helper that returns a string or array — uses alias candidates
function aliasGetFn(obj: object, path: string): string | string[] {
  const candidates = aliasMap[path] ?? [path];
  for (const p of candidates) {
    try {
      const v = fuseDefaultGetFn(obj, p);
      if (v !== "" && v !== []) return v;
    } catch {}
  }
  return "";
}

// USER/PROFILE options — more permissive for broader reach
export const profileSearchOptions: IFuseOptions<object> = {
  includeScore: true,
  threshold: 0.6,
  minMatchCharLength: 1,
  ignoreLocation: true,
  keys: [
    { name: "username", weight: 3.0 },
    { name: "display_name", weight: 2.5 },
    { name: "bio", weight: 1.5 },
    { name: "country", weight: 1.0 },
    { name: "skills", weight: 1.0 },
  ],
  getFn: (obj: object, path: string | string[]) => aliasGetFn(obj, Array.isArray(path) ? path[0] : path),
};

// MARKETPLACE options — slightly stricter for relevance
export const marketplaceSearchOptions: IFuseOptions<object> = {
  includeScore: true,
  threshold: 0.4,
  minMatchCharLength: 2,
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 3.0 },
    { name: "description", weight: 2.0 },
    { name: "category", weight: 1.5 },
    { name: "tags", weight: 1.5 },
    { name: "creator.username", weight: 1.0 },
  ],
  getFn: (obj: object, path: string | string[]) => {
    const p = Array.isArray(path) ? path[0] : path;
    if (p === "tags") {
      const v = aliasGetFn(obj, p);
      return Array.isArray(v) ? v : typeof v === "string" ? v.split(",").map((s: string) => s.trim()) : [];
    }
    return aliasGetFn(obj, p);
  },
};

function createSearchInstance<T extends object>(data: T[], options: IFuseOptions<T>) {
  return new Fuse(data, options);
}

export async function unifiedSearch(query: string, limit = 10): Promise<SearchResult[]> {
  if (!query || !query.trim()) return [];

  // --- Fetch users from Prisma (server-side)
  const users = await prismaUser.user_profile.findMany({
    select: {
      user_id: true,
      username: true,
      display_name: true,
      bio: true,
      avatar_url: true,
      country: true,
    },
  });

  const userFuse = createSearchInstance(users, profileSearchOptions);
  const userResults = userFuse.search(query).slice(0, limit * 2);

  // --- Fetch marketplace items (prismaItems.items — not market_place)
  const items = await prismaItems.items.findMany({
    select: {
      item_id: true,
      title: true,
      description: true,
      category: true,
      price: true,
    },
    take: 300,
  });
  const itemFuse = createSearchInstance(items, marketplaceSearchOptions);
  const itemResults = itemFuse.search(query).slice(0, limit * 2);

  // --- Combine results (normalize id fallbacks)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: SearchResult[] = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...userResults.map((res: any) => {
      const item = res.item as any;
      const id = item.user_id ?? item.id ?? String(item.userId ?? "");
      return {
        type: "profile" as const,
        id,
        title: item.display_name ?? item.username ?? id,
        description: item.bio ?? undefined,
        image: item.avatar_url ?? item.avatarUrl ?? undefined,
        url: `/profile/${id}`,
        score: res.score,
        metadata: { username: item.username, country: item.country } as Record<string, unknown>,
      };
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...itemResults.map((res: any) => {
      const item = res.item;
      const id = item.item_id ?? item.id ?? String(item.itemId ?? "");
      return {
        type: "marketplace" as const,
        id,
        title: item.title ?? item.name ?? id,
        description: item.description ?? undefined,
        image: item.image_url ?? item.imageUrl ?? undefined,
        url: `/items/${id}`,
        score: res.score,
        metadata: { price: item.price, category: item.category } as Record<string, unknown>,
      };
    }),
  ];

  // --- Sort by score and dedup
  const sorted = results
    .sort((a, b) => (a.score ?? 999) - (b.score ?? 999))
    .reduce(
      (acc, cur) => {
        if (!acc.seenIds.has(cur.id)) {
          acc.seenIds.add(cur.id);
          acc.results.push(cur);
        }
        return acc;
      },
      { results: [], seenIds: new Set<string>() }
    );

  return sorted.results.slice(0, limit);
}

// Quick wrapper that keeps score + metadata for UI
export async function quickSearch(query: string, limit = 5) {
  const res = await unifiedSearch(query, limit);
  return res.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    url: r.url,
    image: r.image,
    score: r.score,
    metadata: r.metadata,
  }));
}
