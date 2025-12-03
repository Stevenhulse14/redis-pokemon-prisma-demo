import { type NextRequest, NextResponse } from "next/server"
import { getSQL } from "@/lib/db"

export async function POST(_req: NextRequest) {
  try {
    const db = getSQL()

    console.log("[v0] Starting database setup...")

    // Step 1: Create Pokemon table with lowercase column names
    await db.query(`
      CREATE TABLE IF NOT EXISTS "Pokemon" (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        spriteurl TEXT NOT NULL,
        typeprimary TEXT NOT NULL,
        typesecondary TEXT,
        hp INTEGER NOT NULL,
        attack INTEGER NOT NULL,
        defense INTEGER NOT NULL,
        speed INTEGER NOT NULL,
        createdat TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("[v0] Pokemon table created")

    // Step 2: Create indexes
    await db.query(`CREATE INDEX IF NOT EXISTS "Pokemon_name_idx" ON "Pokemon"(name)`)
    await db.query(`CREATE INDEX IF NOT EXISTS "Pokemon_typeprimary_idx" ON "Pokemon"(typeprimary)`)

    console.log("[v0] Indexes created")

    // Step 3: Seed Pokemon data
    const pokemonData = [
      {
        name: "Pikachu",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        typeprimary: "Electric",
        typesecondary: null,
        hp: 35,
        attack: 55,
        defense: 40,
        speed: 90,
      },
      {
        name: "Charizard",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        typeprimary: "Fire",
        typesecondary: "Flying",
        hp: 78,
        attack: 84,
        defense: 78,
        speed: 100,
      },
      {
        name: "Blastoise",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
        typeprimary: "Water",
        typesecondary: null,
        hp: 79,
        attack: 83,
        defense: 100,
        speed: 78,
      },
      {
        name: "Venusaur",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
        typeprimary: "Grass",
        typesecondary: "Poison",
        hp: 80,
        attack: 82,
        defense: 83,
        speed: 80,
      },
      {
        name: "Gengar",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
        typeprimary: "Ghost",
        typesecondary: "Poison",
        hp: 60,
        attack: 65,
        defense: 60,
        speed: 110,
      },
      {
        name: "Dragonite",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
        typeprimary: "Dragon",
        typesecondary: "Flying",
        hp: 91,
        attack: 134,
        defense: 95,
        speed: 80,
      },
      {
        name: "Mewtwo",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
        typeprimary: "Psychic",
        typesecondary: null,
        hp: 106,
        attack: 110,
        defense: 90,
        speed: 130,
      },
      {
        name: "Alakazam",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png",
        typeprimary: "Psychic",
        typesecondary: null,
        hp: 55,
        attack: 50,
        defense: 45,
        speed: 120,
      },
      {
        name: "Gyarados",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
        typeprimary: "Water",
        typesecondary: "Flying",
        hp: 95,
        attack: 125,
        defense: 79,
        speed: 81,
      },
      {
        name: "Lapras",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
        typeprimary: "Water",
        typesecondary: "Ice",
        hp: 130,
        attack: 85,
        defense: 80,
        speed: 60,
      },
      {
        name: "Snorlax",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
        typeprimary: "Normal",
        typesecondary: null,
        hp: 160,
        attack: 110,
        defense: 65,
        speed: 30,
      },
      {
        name: "Articuno",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png",
        typeprimary: "Ice",
        typesecondary: "Flying",
        hp: 90,
        attack: 85,
        defense: 100,
        speed: 85,
      },
      {
        name: "Zapdos",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png",
        typeprimary: "Electric",
        typesecondary: "Flying",
        hp: 90,
        attack: 90,
        defense: 85,
        speed: 100,
      },
      {
        name: "Moltres",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png",
        typeprimary: "Fire",
        typesecondary: "Flying",
        hp: 90,
        attack: 100,
        defense: 90,
        speed: 90,
      },
      {
        name: "Mew",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
        typeprimary: "Psychic",
        typesecondary: null,
        hp: 100,
        attack: 100,
        defense: 100,
        speed: 100,
      },
      {
        name: "Lucario",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png",
        typeprimary: "Fighting",
        typesecondary: "Steel",
        hp: 70,
        attack: 110,
        defense: 70,
        speed: 90,
      },
      {
        name: "Garchomp",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png",
        typeprimary: "Dragon",
        typesecondary: "Ground",
        hp: 108,
        attack: 130,
        defense: 95,
        speed: 102,
      },
      {
        name: "Umbreon",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png",
        typeprimary: "Dark",
        typesecondary: null,
        hp: 95,
        attack: 65,
        defense: 110,
        speed: 65,
      },
      {
        name: "Espeon",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png",
        typeprimary: "Psychic",
        typesecondary: null,
        hp: 65,
        attack: 65,
        defense: 60,
        speed: 110,
      },
      {
        name: "Tyranitar",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png",
        typeprimary: "Rock",
        typesecondary: "Dark",
        hp: 100,
        attack: 134,
        defense: 110,
        speed: 61,
      },
      {
        name: "Scizor",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/212.png",
        typeprimary: "Bug",
        typesecondary: "Steel",
        hp: 70,
        attack: 130,
        defense: 100,
        speed: 65,
      },
      {
        name: "Absol",
        spriteurl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/359.png",
        typeprimary: "Dark",
        typesecondary: null,
        hp: 65,
        attack: 130,
        defense: 60,
        speed: 75,
      },
    ]

    for (const pokemon of pokemonData) {
      await db.query(
        `INSERT INTO "Pokemon" (name, spriteurl, typeprimary, typesecondary, hp, attack, defense, speed)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (name) DO NOTHING`,
        [
          pokemon.name,
          pokemon.spriteurl,
          pokemon.typeprimary,
          pokemon.typesecondary,
          pokemon.hp,
          pokemon.attack,
          pokemon.defense,
          pokemon.speed,
        ]
      )
    }

    console.log("[v0] Pokemon data seeded")

    return NextResponse.json(
      {
        success: true,
        message: "Database setup complete! 22 Pokemon added.",
        count: pokemonData.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Setup error:", error)
    return NextResponse.json(
      {
        error: "Failed to set up database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
