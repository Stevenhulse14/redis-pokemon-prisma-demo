// app/api/metrics/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET(_req: NextRequest) {
  if (!redis) {
    return NextResponse.json(
      {
        hits: 0,
        misses: 0,
        hitRate: 0,
        total: 0,
        efficiency: 0,
        estimatedCacheSize: 0,
        lastReset: null,
        timeSinceReset: "N/A",
        redisEnabled: false,
      },
      { status: 200 },
    )
  }

  try {
    const [hitsRaw, missesRaw, lastResetRaw] = await redis.mGet([
      "metrics:hits",
      "metrics:misses",
      "metrics:lastReset",
    ])

    const hits = Number(hitsRaw ?? 0)
    const misses = Number(missesRaw ?? 0)
    const total = hits + misses
    const hitRate = total > 0 ? hits / total : 0
    
    // Initialize lastReset if it doesn't exist
    let lastReset = lastResetRaw ? Number(lastResetRaw) : Date.now()
    if (!lastResetRaw) {
      await redis.set("metrics:lastReset", lastReset.toString()).catch(() => {})
    }

    // Calculate cache efficiency (hits / total requests)
    const efficiency = total > 0 ? (hits / total) * 100 : 0

    // Estimate cache size (count keys matching patterns)
    // Note: This is an approximation since we can't easily scan all keys
    let estimatedCacheSize = 0
    try {
      // Try to get a sample of cache keys
      const sampleKeys = Array.from({ length: 20 }, (_, i) => `pokemon:${i + 1}`)
      const sampleValues = await redis.mGet(sampleKeys)
      estimatedCacheSize = sampleValues.filter((v) => v !== null).length
      // Estimate total based on sample (rough approximation)
      estimatedCacheSize = Math.min(estimatedCacheSize * 3, 50) // Cap at reasonable estimate
    } catch {
      // If we can't estimate, use 0
    }

    // Calculate time since last reset
    const timeSinceReset = Date.now() - lastReset
    const minutesSinceReset = Math.floor(timeSinceReset / 60000)
    const secondsSinceReset = Math.floor((timeSinceReset % 60000) / 1000)

    return NextResponse.json(
      {
        hits,
        misses,
        hitRate,
        total,
        efficiency,
        estimatedCacheSize,
        lastReset: lastResetRaw ? lastReset : null,
        timeSinceReset: minutesSinceReset > 0 
          ? `${minutesSinceReset}m ${secondsSinceReset}s`
          : `${secondsSinceReset}s`,
        redisEnabled: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[api/metrics] Redis error:", error)
    return NextResponse.json(
      {
        hits: 0,
        misses: 0,
        hitRate: 0,
        total: 0,
        efficiency: 0,
        estimatedCacheSize: 0,
        lastReset: null,
        timeSinceReset: "N/A",
        redisEnabled: true,
        error: "Failed to read metrics",
      },
      { status: 500 },
    )
  }
}
