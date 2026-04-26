// src/lib/mongoose/items.ts

import { Collection } from "mongoose";
import { connectToDatabase } from "./connection";
// import { Item } from "./types/Item";
import { Item } from "@repo/database-mongo";
import { prismaItem } from "../db";

// Re-export the Mongoose model so API routes can import it directly
export { Item as ItemModel };
interface FetchItemsOptions {
  userId?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export async function fetchItems(
  options: FetchItemsOptions = {}
): Promise<{
  items: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}> {
  const { userId, page = 1, limit = 10, category } = options;
  const skip = (page - 1) * limit;

  // fetchItems called with options

  try {
    const timerLabel = `⏱️ fetchItems total duration (${Date.now()})`;
    console.time(timerLabel);

    // --- 1. Connect to MongoDB ---
    const connectLabel = `⏱️ MongoDB connect (${Date.now()})`;
    console.time(connectLabel);
    await connectToDatabase();
    console.timeEnd(connectLabel);

    // Get collection from shared model
    const itemsCollection = Item.collection as Collection<any>;
    if (!itemsCollection) throw new Error("MongoDB collection 'items' not found");

    // --- 2. Construct Mongo query ---
    const query: Record<string, any> = {};
    if (userId) query.userId = userId;
    if (category) query.category = category;

    // MongoDB query constructed

    // --- 3. Fetch from Mongo ---
    const fetchLabel = `⏱️ MongoDB fetch (${Date.now()})`;
    console.time(fetchLabel);
    const mongoItems = await itemsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await itemsCollection.countDocuments(query);
    console.timeEnd(fetchLabel);

    if (!mongoItems.length) {
      return {
        items: [],
        pagination: { total: totalCount, page, limit, hasMore: false },
      };
    }

    // --- 4. Fetch from PostgreSQL (items_d schema) ---
    const mongoIds = mongoItems.map((it) => String(it._id));
    // Fetching corresponding SQL entries from Prisma
    console.time("⏱️ Prisma fetch");
    const sqlItems = await prismaItem.items.findMany({
      where: { item_id: { in: mongoIds } },
      select: {
        item_id: true,
        price: true,
        category: true,
        monetization_type: true,
        reviews: { select: { rating: true } },
        transactions: { select: { transaction_id: true } },
      },
    });
    console.timeEnd("⏱️ Prisma fetch");

    // --- 5. Normalize SQL results ---
    const sqlMap = new Map<
      string,
      { price: number; rating: number | null; sales: number; monetizationType: string | null }
    >();

    for (const s of sqlItems) {
      const ratings = s.reviews?.map((r) => r.rating ?? 0) ?? [];
      const avgRating = ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null;

      sqlMap.set(s.item_id, {
        price: parseFloat(s.price?.toString() ?? "0"),
        rating: avgRating,
        sales: s.transactions?.length ?? 0,
        monetizationType: s.monetization_type ?? null,
      });
    }

    // SQL map prepared

    // --- 6. Merge Mongo + SQL ---
    const mergedItems: any[] = mongoItems.map((mongo) => {
      const mongoId = String(mongo._id);
      const sql = sqlMap.get(mongoId);

      return {
        ...mongo,
        _id: mongoId,
        price: sql?.price ?? mongo.price ?? 0,
        rating: sql?.rating ?? mongo.ratings?.length ?? null,
        sales: sql?.sales ?? 0,
        monetizationType: sql?.monetizationType ?? mongo.monetizationType ?? "one-time",
      };
    });

    console.timeEnd(timerLabel);

    // --- 7. Return merged result ---
    return {
      items: mergedItems,
      pagination: {
        total: totalCount,
        page,
        limit,
        hasMore: skip + mergedItems.length < totalCount,
      },
    };
  } catch (err) {
    console.error("💥 Error in fetchItems:", err);
    throw err;
  }
}
