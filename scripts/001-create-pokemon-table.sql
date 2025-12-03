-- Create Pokemon table
CREATE TABLE IF NOT EXISTS "Pokemon" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  "spriteUrl" TEXT NOT NULL,
  "typePrimary" TEXT NOT NULL,
  "typeSecondary" TEXT,
  hp INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "Pokemon_name_idx" ON "Pokemon"(name);
CREATE INDEX IF NOT EXISTS "Pokemon_typePrimary_idx" ON "Pokemon"("typePrimary");
