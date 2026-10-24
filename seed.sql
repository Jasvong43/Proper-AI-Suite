-- Seed the six specialist agents tracked by the orchestrator.
-- ProperViral and ProperFlux are represented in the UI but were never part of
-- the original systemState.agents map; they are added here for completeness.
INSERT OR IGNORE INTO agents (key, name, status, kb_version) VALUES
  ('viral',   'ProperViral',   'Idle', 'v4.0'),
  ('storyz',  'ProperStoryz',  'Idle', 'v4.1'),
  ('vocal',   'ProperVoCaL',   'Idle', 'v3.5'),
  ('pixelz',  'ProperPixelz',  'Idle', 'v4.2'),
  ('fuzion',  'ProperFuzion',  'Idle', 'v3.8'),
  ('socialz', 'ProperSocialz', 'Idle', 'v4.5'),
  ('flux',    'ProperFlux',    'Idle', 'v2.9');
