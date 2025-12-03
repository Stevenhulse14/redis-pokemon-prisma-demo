// Script to seed moves for Pokemon
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ Error: POSTGRES_PRISMA_URL or DATABASE_URL environment variable is not set");
  process.exit(1);
}

const url = new URL(databaseUrl);
const isSupabase = url.hostname.includes("supabase") || url.hostname.includes("pooler");

const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  database: url.pathname.slice(1),
  user: url.username,
  password: url.password,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});

// Common moves that many Pokemon can learn
const commonMoves = [
  { name: "Tackle", type: "Normal", category: "physical", power: 40, accuracy: 100, pp: 35, description: "A physical attack." },
  { name: "Growl", type: "Normal", category: "status", power: null, accuracy: 100, pp: 40, description: "Lowers the target's Attack stat." },
  { name: "Scratch", type: "Normal", category: "physical", power: 40, accuracy: 100, pp: 35, description: "Hard, pointed claws rake the target." },
  { name: "Ember", type: "Fire", category: "special", power: 40, accuracy: 100, pp: 25, description: "The target is attacked with small flames." },
  { name: "Water Gun", type: "Water", category: "special", power: 40, accuracy: 100, pp: 25, description: "The target is blasted with a forceful shot of water." },
  { name: "Vine Whip", type: "Grass", category: "physical", power: 45, accuracy: 100, pp: 25, description: "The target is struck with slender, whiplike vines." },
  { name: "Thunder Shock", type: "Electric", category: "special", power: 40, accuracy: 100, pp: 30, description: "A jolt of electricity crashes down on the target." },
  { name: "Quick Attack", type: "Normal", category: "physical", power: 40, accuracy: 100, pp: 30, description: "The user lunges at the target at a speed that makes it almost invisible." },
  { name: "Flamethrower", type: "Fire", category: "special", power: 90, accuracy: 100, pp: 15, description: "The target is scorched with an intense blast of fire." },
  { name: "Hydro Pump", type: "Water", category: "special", power: 110, accuracy: 80, pp: 5, description: "The target is blasted by a huge volume of water launched under great pressure." },
  { name: "Solar Beam", type: "Grass", category: "special", power: 120, accuracy: 100, pp: 10, description: "A two-turn attack. The user gathers light, then blasts a bundled beam on the next turn." },
  { name: "Thunderbolt", type: "Electric", category: "special", power: 90, accuracy: 100, pp: 15, description: "A strong electric blast crashes down on the target." },
  { name: "Ice Beam", type: "Ice", category: "special", power: 90, accuracy: 100, pp: 10, description: "The target is struck with an icy-cold beam of energy." },
  { name: "Psychic", type: "Psychic", category: "special", power: 90, accuracy: 100, pp: 10, description: "The target is hit by a strong telekinetic force." },
  { name: "Shadow Ball", type: "Ghost", category: "special", power: 80, accuracy: 100, pp: 15, description: "The user hurls a shadowy blob at the target." },
  { name: "Dragon Claw", type: "Dragon", category: "physical", power: 80, accuracy: 100, pp: 15, description: "The user slashes the target with huge, sharp claws." },
  { name: "Earthquake", type: "Ground", category: "physical", power: 100, accuracy: 100, pp: 10, description: "The user sets off an earthquake that strikes every Pokémon around it." },
  { name: "Stone Edge", type: "Rock", category: "physical", power: 100, accuracy: 80, pp: 5, description: "The user stabs the target with sharpened stones from below." },
  { name: "Aerial Ace", type: "Flying", category: "physical", power: 60, accuracy: null, pp: 20, description: "The user confounds the target with speed, then slashes." },
  { name: "Dark Pulse", type: "Dark", category: "special", power: 80, accuracy: 100, pp: 15, description: "The user releases a horrible aura imbued with dark thoughts." },
  { name: "Dazzling Gleam", type: "Fairy", category: "special", power: 80, accuracy: 100, pp: 10, description: "The user damages opposing Pokémon by emitting a powerful flash." },
  { name: "Flash Cannon", type: "Steel", category: "special", power: 80, accuracy: 100, pp: 10, description: "The user gathers all its light energy and releases it at once." },
  { name: "Focus Blast", type: "Fighting", category: "special", power: 120, accuracy: 70, pp: 5, description: "The user heightens its mental focus and unleashes its power." },
  { name: "Hyper Beam", type: "Normal", category: "special", power: 150, accuracy: 90, pp: 5, description: "The target is attacked with a powerful beam. The user can't move on the next turn." },
];

// Pokemon-specific move sets (pokemon name -> moves with levels)
const pokemonMoves: Record<string, Array<{ moveName: string; level?: number }>> = {
  "Charizard": [
    { moveName: "Scratch", level: 1 },
    { moveName: "Growl", level: 1 },
    { moveName: "Ember", level: 7 },
    { moveName: "Flamethrower", level: 34 },
    { moveName: "Aerial Ace" },
    { moveName: "Dragon Claw" },
  ],
  "Blastoise": [
    { moveName: "Tackle", level: 1 },
    { moveName: "Growl", level: 1 },
    { moveName: "Water Gun", level: 7 },
    { moveName: "Hydro Pump", level: 42 },
    { moveName: "Ice Beam" },
    { moveName: "Flash Cannon" },
  ],
  "Venusaur": [
    { moveName: "Tackle", level: 1 },
    { moveName: "Growl", level: 1 },
    { moveName: "Vine Whip", level: 7 },
    { moveName: "Solar Beam", level: 50 },
    { moveName: "Earthquake" },
    { moveName: "Shadow Ball" },
  ],
  "Pikachu": [
    { moveName: "Thunder Shock", level: 1 },
    { moveName: "Quick Attack", level: 5 },
    { moveName: "Thunderbolt", level: 26 },
    { moveName: "Thunder", level: 50 },
  ],
  "Gengar": [
    { moveName: "Shadow Ball" },
    { moveName: "Dark Pulse" },
    { moveName: "Sludge Bomb" },
    { moveName: "Thunderbolt" },
  ],
  "Dragonite": [
    { moveName: "Dragon Claw" },
    { moveName: "Aerial Ace" },
    { moveName: "Thunderbolt" },
    { moveName: "Ice Beam" },
    { moveName: "Earthquake" },
  ],
  "Mewtwo": [
    { moveName: "Psychic" },
    { moveName: "Shadow Ball" },
    { moveName: "Focus Blast" },
    { moveName: "Ice Beam" },
    { moveName: "Thunderbolt" },
    { moveName: "Flamethrower" },
  ],
};

async function main() {
  console.log("🌱 Seeding moves...");

  // Insert common moves
  for (const move of commonMoves) {
    await pool.query(
      `INSERT INTO "Move" (name, type, category, power, accuracy, pp, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (name) DO NOTHING`,
      [move.name, move.type, move.category, move.power, move.accuracy, move.pp, move.description]
    );
  }

  console.log(`✅ Inserted ${commonMoves.length} moves`);

  // Get Pokemon IDs
  const pokemonResult = await pool.query('SELECT id, name FROM "Pokemon"');
  const pokemonMap = new Map(pokemonResult.rows.map((p: any) => [p.name, p.id]));

  // Get Move IDs
  const movesResult = await pool.query('SELECT id, name FROM "Move"');
  const moveMap = new Map(movesResult.rows.map((m: any) => [m.name, m.id]));

  // Assign moves to Pokemon
  let assignedCount = 0;
  for (const [pokemonName, moves] of Object.entries(pokemonMoves)) {
    const pokemonId = pokemonMap.get(pokemonName);
    if (!pokemonId) continue;

    // Assign 4-6 random common moves if no specific moves defined
    const movesToAssign = moves.length > 0 
      ? moves 
      : commonMoves.slice(0, 6).map(m => ({ moveName: m.name }));

    for (const { moveName, level } of movesToAssign) {
      const moveId = moveMap.get(moveName);
      if (!moveId) continue;

      try {
        await pool.query(
          `INSERT INTO "PokemonMove" ("pokemonId", "moveId", level)
           VALUES ($1, $2, $3)
           ON CONFLICT ("pokemonId", "moveId") DO NOTHING`,
          [pokemonId, moveId, level || null]
        );
        assignedCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }

  // Assign random moves to Pokemon without specific moves
  for (const pokemon of pokemonResult.rows) {
    const existingMoves = await pool.query(
      'SELECT COUNT(*) FROM "PokemonMove" WHERE "pokemonId" = $1',
      [pokemon.id]
    );
    
    if (existingMoves.rows[0].count === "0") {
      // Assign 4-6 random moves
      const randomMoves = commonMoves
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 4);
      
      for (const move of randomMoves) {
        const moveId = moveMap.get(move.name);
        if (moveId) {
          await pool.query(
            `INSERT INTO "PokemonMove" ("pokemonId", "moveId", level)
             VALUES ($1, $2, $3)
             ON CONFLICT ("pokemonId", "moveId") DO NOTHING`,
            [pokemon.id, moveId, null]
          );
          assignedCount++;
        }
      }
    }
  }

  console.log(`✅ Assigned ${assignedCount} moves to Pokemon`);
  console.log("🎉 Moves seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

