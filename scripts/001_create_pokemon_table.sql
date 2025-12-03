-- Create Pokemon table
CREATE TABLE IF NOT EXISTS "Pokemon" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  "spriteUrl" VARCHAR(500) NOT NULL,
  "typePrimary" VARCHAR(50) NOT NULL,
  "typeSecondary" VARCHAR(50),
  hp INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS "Pokemon_name_idx" ON "Pokemon" (name);
CREATE INDEX IF NOT EXISTS "Pokemon_typePrimary_idx" ON "Pokemon" ("typePrimary");
CREATE INDEX IF NOT EXISTS "Pokemon_typeSecondary_idx" ON "Pokemon" ("typeSecondary");
