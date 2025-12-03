import { type NextRequest, NextResponse } from "next/server";
import { getSQL } from "@/lib/db";
import { redis } from "@/lib/redis";

const POKEMON_TTL_SECONDS = 300;

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

  const cacheKey = `pokemon:${id}`;

  try {
    // 1. Try cache first
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const pokemon = JSON.parse(cached);
          await redis.incr("metrics:hits").catch(() => {});
          return NextResponse.json(
            { pokemon, source: "cache" as const },
            { status: 200 }
          );
        }
      } catch (error) {
        console.error("[redis] Cache read error:", error);
      }
    }

    // 2. Cache miss → hit DB with direct SQL
    const db = getSQL();
    const result = await db.query(
      `SELECT 
        id, 
        name, 
        "spriteUrl", 
        "typePrimary", 
        "typeSecondary",
        hp,
        attack,
        defense,
        "specialAttack",
        "specialDefense",
        speed,
        "createdAt",
        "updatedAt"
      FROM "Pokemon"
      WHERE id = $1
      LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Pokémon not found" }, { status: 404 });
    }

    const pokemon = result.rows[0];

    // 3. Store in cache for next time
    if (redis) {
      try {
        await redis.set(cacheKey, JSON.stringify(pokemon), {
          EX: POKEMON_TTL_SECONDS,
        });
        await redis.incr("metrics:misses");
      } catch (error) {
        console.error("[redis] Cache write error:", error);
      }
    }

    return NextResponse.json(
      { pokemon, source: "db" as const },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/pokemon/[id]] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST endpoint to bust cache
export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const idParam = params.id;
  const id = Number(idParam);

  if (Number.isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid Pokémon ID" }, { status: 400 });
  }

  const cacheKey = `pokemon:${id}`;

  try {
    if (redis) {
      try {
        await redis.del(cacheKey);
      } catch (error) {
        console.error("[redis] Delete error:", error);
      }
    }

    return NextResponse.json(
      { message: "Cache busted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/pokemon/[id]] Cache bust error:", error);
    return NextResponse.json(
      { error: "Failed to bust cache" },
      { status: 500 }
    );
  }
}

// Function to increment metrics
async function incrementMetric(kind: "hits" | "misses") {
  if (!redis) return;
  const key = `metrics:${kind}`;
  try {
    await redis.incr(key);
  } catch (error) {
    console.warn(`[metrics] Failed to increment ${kind}:`, error);
  }
}
