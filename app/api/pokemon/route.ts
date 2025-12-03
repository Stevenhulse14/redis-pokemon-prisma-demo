import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { getSQL } = await import("@/lib/db")
    const { redis } = await import("@/lib/redis")

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")?.trim() ?? ""
    const normalizedQuery = query.toLowerCase()
    const cacheKey = normalizedQuery ? `search:${normalizedQuery}` : "search:all"

    // Try cache
    if (redis) {
      try {
        const cached = await redis.get(cacheKey)
        if (cached) {
          const pokemonList = JSON.parse(cached)
          await redis.incr("metrics:hits").catch(() => {})
          return NextResponse.json({ pokemon: pokemonList, source: "cache" })
        }
      } catch (error) {
        console.error("[redis] Cache read error:", error)
      }
    }

    const db = getSQL()

    const pokemon = normalizedQuery
      ? await db.query(
          `SELECT 
            id, 
            name, 
            "spriteUrl", 
            "typePrimary", 
            "typeSecondary"
          FROM "Pokemon"
          WHERE 
            LOWER(name) LIKE $1
            OR LOWER("typePrimary") LIKE $1
            OR LOWER(COALESCE("typeSecondary", '')) LIKE $1
          ORDER BY id ASC`,
          [`%${normalizedQuery}%`]
        )
      : await db.query(
          `SELECT 
            id, 
            name, 
            "spriteUrl", 
            "typePrimary", 
            "typeSecondary"
          FROM "Pokemon"
          ORDER BY id ASC`
        )

    const pokemonRows = pokemon.rows

    // Cache result
    if (redis) {
      try {
        await redis.set(cacheKey, JSON.stringify(pokemonRows), { EX: 120 })
        await redis.incr("metrics:misses")
      } catch (error) {
        console.error("[redis] Cache write error:", error)
      }
    }

    return NextResponse.json({ pokemon: pokemonRows, source: "db" })
  } catch (error) {
    console.error("[api/pokemon] Error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("[api/pokemon] Error details:", { errorMessage, errorStack })
    return NextResponse.json({ 
      error: "Internal server error", 
      message: errorMessage,
      pokemon: [] 
    }, { status: 500 })
  }
}
