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
        redisEnabled: false,
      },
      { status: 200 },
    )
  }

  try {
    const [hitsRaw, missesRaw] = await redis.mGet(["metrics:hits", "metrics:misses"])

    const hits = Number(hitsRaw ?? 0)
    const misses = Number(missesRaw ?? 0)
    const total = hits + misses
    const hitRate = total > 0 ? hits / total : 0

    return NextResponse.json(
      {
        hits,
        misses,
        hitRate,
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
        redisEnabled: true,
        error: "Failed to read metrics",
      },
      { status: 500 },
    )
  }
}
