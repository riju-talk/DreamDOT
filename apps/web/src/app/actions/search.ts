"use server"

// Server Action boundary — must only export async functions.
// All search logic/config lives in @/lib/search.

import {
  unifiedSearch as unifiedSearchImpl,
  quickSearch as quickSearchImpl,
} from "@/lib/search";
import type { SearchResult } from "@/lib/search";

export async function unifiedSearch(
  query: string,
  limit = 10
): Promise<SearchResult[]> {
  return unifiedSearchImpl(query, limit);
}

export async function quickSearch(query: string, limit = 5) {
  return quickSearchImpl(query, limit);
}