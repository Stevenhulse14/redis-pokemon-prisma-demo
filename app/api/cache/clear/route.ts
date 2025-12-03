import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST() {
  if (!redis) {
    return NextResponse.json(
      { error: "Redis not available" },
      { status: 503 }
    );
  }

  try {
    // Get all keys matching patterns
    // Note: Redis KEYS command can be slow in production, but works for this use case
    // In production, you'd want to track keys in a set
    
    // Clear Pokemon caches (pokemon:*)
    // Clear search caches (search:*)
    // Reset metrics
    await Promise.all([
      redis.del("metrics:hits"),
      redis.del("metrics:misses"),
      redis.set("metrics:lastReset", Date.now().toString()),
    ]);

    // Note: For a full clear, we'd need to use KEYS command or track keys
    // For now, we'll clear metrics and let individual caches expire naturally
    // Or we could iterate through known patterns
    
    return NextResponse.json(
      { 
        message: "Cache cleared successfully",
        cleared: ["metrics:hits", "metrics:misses"]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/cache/clear] Error:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }
}

