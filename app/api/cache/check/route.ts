import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  if (!redis) {
    return NextResponse.json(
      { error: "Redis not available", cache: {} },
      { status: 503 }
    );
  }

  try {
    // Check for common cache keys
    const cacheKeys = [
      "metrics:hits",
      "metrics:misses",
      "search:all",
    ];

    // Try to get a few Pokemon cache entries (check first 10 IDs)
    const pokemonKeys = Array.from({ length: 10 }, (_, i) => `pokemon:${i + 1}`);
    
    const allKeys = [...cacheKeys, ...pokemonKeys];
    const cacheData: Record<string, any> = {};

    // Fetch all keys
    for (const key of allKeys) {
      try {
        const value = await redis.get(key);
        if (value) {
          try {
            cacheData[key] = JSON.parse(value);
          } catch {
            cacheData[key] = value;
          }
        }
      } catch (error) {
        // Skip errors for individual keys
      }
    }

    return NextResponse.json(
      {
        cache: cacheData,
        keysFound: Object.keys(cacheData).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/cache/check] Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to check cache",
        cache: {},
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

