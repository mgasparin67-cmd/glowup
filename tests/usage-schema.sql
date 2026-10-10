CREATE TABLE IF NOT EXISTS analysis_reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, visitor_hash TEXT NOT NULL, day TEXT NOT NULL, hour TEXT NOT NULL, created_at INTEGER NOT NULL);
DELETE FROM analysis_reservations;
