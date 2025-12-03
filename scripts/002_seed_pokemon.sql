-- Seed Pokemon data (only if table is empty)
INSERT INTO "Pokemon" (name, "spriteUrl", "typePrimary", "typeSecondary", hp, attack, defense, speed)
SELECT * FROM (VALUES
  ('Bulbasaur', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 'Grass', 'Poison', 45, 49, 49, 45),
  ('Ivysaur', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', 'Grass', 'Poison', 60, 62, 63, 60),
  ('Venusaur', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', 'Grass', 'Poison', 80, 82, 83, 80),
  ('Charmander', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', 'Fire', NULL, 39, 52, 43, 65),
  ('Charmeleon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png', 'Fire', NULL, 58, 64, 58, 80),
  ('Charizard', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', 'Fire', 'Flying', 78, 84, 78, 100),
  ('Squirtle', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', 'Water', NULL, 44, 48, 65, 43),
  ('Wartortle', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png', 'Water', NULL, 59, 63, 80, 58),
  ('Blastoise', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', 'Water', NULL, 79, 83, 100, 78),
  ('Pikachu', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', 'Electric', NULL, 35, 55, 40, 90),
  ('Raichu', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png', 'Electric', NULL, 60, 90, 55, 110),
  ('Jigglypuff', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png', 'Fairy', NULL, 115, 45, 20, 20),
  ('Meowth', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png', 'Normal', NULL, 40, 45, 35, 90),
  ('Psyduck', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png', 'Water', NULL, 50, 52, 48, 55),
  ('Golduck', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png', 'Water', NULL, 80, 82, 78, 85),
  ('Machop', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png', 'Fighting', NULL, 70, 80, 50, 35),
  ('Gastly', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png', 'Ghost', 'Poison', 30, 35, 30, 80),
  ('Haunter', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png', 'Ghost', 'Poison', 45, 50, 45, 95),
  ('Gengar', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png', 'Ghost', 'Poison', 60, 65, 60, 110),
  ('Eevee', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', 'Normal', NULL, 55, 55, 50, 55),
  ('Mewtwo', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', 'Psychic', NULL, 106, 110, 90, 130),
  ('Mew', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', 'Psychic', NULL, 100, 100, 100, 100)
) AS v(name, "spriteUrl", "typePrimary", "typeSecondary", hp, attack, defense, speed)
WHERE NOT EXISTS (SELECT 1 FROM "Pokemon" LIMIT 1);
