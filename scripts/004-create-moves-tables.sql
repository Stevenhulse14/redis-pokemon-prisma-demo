-- Create Move table
CREATE TABLE IF NOT EXISTS "Move" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('physical', 'special', 'status')),
  power INTEGER,
  accuracy INTEGER,
  pp INTEGER NOT NULL,
  description TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create PokemonMove junction table
CREATE TABLE IF NOT EXISTS "PokemonMove" (
  id SERIAL PRIMARY KEY,
  "pokemonId" INTEGER NOT NULL REFERENCES "Pokemon"(id) ON DELETE CASCADE,
  "moveId" INTEGER NOT NULL REFERENCES "Move"(id) ON DELETE CASCADE,
  level INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("pokemonId", "moveId")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "PokemonMove_pokemonId_idx" ON "PokemonMove"("pokemonId");
CREATE INDEX IF NOT EXISTS "PokemonMove_moveId_idx" ON "PokemonMove"("moveId");
CREATE INDEX IF NOT EXISTS "Move_type_idx" ON "Move"(type);
CREATE INDEX IF NOT EXISTS "Move_category_idx" ON "Move"(category);

