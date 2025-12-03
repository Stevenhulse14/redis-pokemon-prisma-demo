import { type NextRequest, NextResponse } from "next/server";
import { getSQL } from "@/lib/db";
import { redis } from "@/lib/redis";

const MOVES_TTL_SECONDS = 600; // 10 minutes

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const idParam = params.id;
  const id = Number(idParam);

  if (Number.isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid Pokémon ID" }, { status: 400 });
  }

  const cacheKey = `pokemon:${id}:moves`;

  try {
    // 1. Try cache first
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const moves = JSON.parse(cached);
          await redis.incr("metrics:hits").catch(() => {});
          return NextResponse.json(
            { moves, source: "cache" as const },
            { status: 200 }
          );
        }
      } catch (error) {
        console.error("[redis] Cache read error:", error);
      }
    }

    // 2. Cache miss → hit DB
    const db = getSQL();
    const result = await db.query(
      `SELECT 
        m.id,
        m.name,
        m.type,
        m.category,
        m.power,
        m.accuracy,
        m.pp,
        m.description,
        pm.level
      FROM "PokemonMove" pm
      INNER JOIN "Move" m ON pm."moveId" = m.id
      WHERE pm."pokemonId" = $1
      ORDER BY pm.level ASC NULLS LAST, m.name ASC`,
      [id]
    );

    const moves = result.rows;

    // 3. Store in cache
    if (redis) {
      try {
        await redis.set(cacheKey, JSON.stringify(moves), {
          EX: MOVES_TTL_SECONDS,
        });
        await redis.incr("metrics:misses");
      } catch (error) {
        console.error("[redis] Cache write error:", error);
      }
    }

    return NextResponse.json(
      { moves, source: "db" as const },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/pokemon/[id]/moves] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        moves: [],
      },
      { status: 500 }
    );
  }
}

