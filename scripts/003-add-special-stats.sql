-- Add Special Attack and Special Defense columns
ALTER TABLE "Pokemon" 
ADD COLUMN IF NOT EXISTS "specialAttack" INTEGER,
ADD COLUMN IF NOT EXISTS "specialDefense" INTEGER;

-- Set default values for existing rows (will be updated by seed)
UPDATE "Pokemon" 
SET "specialAttack" = attack, 
    "specialDefense" = defense 
WHERE "specialAttack" IS NULL OR "specialDefense" IS NULL;

