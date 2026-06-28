CREATE TABLE IF NOT EXISTS quiz_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  rizz_score INTEGER NOT NULL,
  in_relationship TEXT NOT NULL CHECK (in_relationship IN ('yes', 'no')),
  prays_before_eating TEXT NOT NULL CHECK (prays_before_eating IN ('yes', 'no')),
  likes_guitar_boys TEXT NOT NULL CHECK (likes_guitar_boys IN ('yes', 'no')),
  likes_tech_boys TEXT NOT NULL CHECK (likes_tech_boys IN ('yes', 'no')),
  likes_510_plus_men TEXT NOT NULL CHECK (likes_510_plus_men IN ('yes', 'no')),
  likes_men_who_cook TEXT NOT NULL CHECK (likes_men_who_cook IN ('yes', 'no')),
  likes_forehead_kisses TEXT NOT NULL CHECK (likes_forehead_kisses IN ('yes', 'no')),
  wants_date INTEGER NOT NULL CHECK (wants_date IN (0, 1)),
  preferred_date TEXT,
  preferred_time TEXT,
  date_idea TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quiz_submissions_created_at
ON quiz_submissions (created_at DESC);
