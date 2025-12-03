-- Seed Pokemon data
INSERT INTO "Pokemon" (name, "spriteUrl", "typePrimary", "typeSecondary", hp, attack, defense, speed)
VALUES
  ('Pikachu', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', 'Electric', NULL, 35, 55, 40, 90),
  ('Charizard', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', 'Fire', 'Flying', 78, 84, 78, 100),
  ('Blastoise', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', 'Water', NULL, 79, 83, 100, 78),
  ('Venusaur', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', 'Grass', 'Poison', 80, 82, 83, 80),
  ('Gengar', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png', 'Ghost', 'Poison', 60, 65, 60, 110),
  ('Dragonite', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', 'Dragon', 'Flying', 91, 134, 95, 80),
  ('Mewtwo', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', 'Psychic', NULL, 106, 110, 90, 130),
  ('Alakazam', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png', 'Psychic', NULL, 55, 50, 45, 120),
  ('Gyarados', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png', 'Water', 'Flying', 95, 125, 79, 81),
  ('Lapras', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png', 'Water', 'Ice', 130, 85, 80, 60),
  ('Snorlax', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png', 'Normal', NULL, 160, 110, 65, 30),
  ('Articuno', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png', 'Ice', 'Flying', 90, 85, 100, 85),
  ('Zapdos', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png', 'Electric', 'Flying', 90, 90, 85, 100),
  ('Moltres', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png', 'Fire', 'Flying', 90, 100, 90, 90),
  ('Mew', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', 'Psychic', NULL, 100, 100, 100, 100),
  ('Lucario', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png', 'Fighting', 'Steel', 70, 110, 70, 90),
  ('Garchomp', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png', 'Dragon', 'Ground', 108, 130, 95, 102),
  ('Umbreon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png', 'Dark', NULL, 95, 65, 110, 65),
  ('Espeon', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png', 'Psychic', NULL, 65, 65, 60, 110),
  ('Tyranitar', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png', 'Rock', 'Dark', 100, 134, 110, 61),
  ('Scizor', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/212.png', 'Bug', 'Steel', 70, 130, 100, 65),
  ('Absol', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/359.png', 'Dark', NULL, 65, 130, 60, 75)
ON CONFLICT (name) DO NOTHING;
