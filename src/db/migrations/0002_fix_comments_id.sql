CREATE TABLE IF NOT EXISTS comments_new (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  post_slug TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER,
  content TEXT NOT NULL,
  parent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_approved INTEGER DEFAULT 0
);

INSERT INTO comments_new (id, post_slug, username, email, rating, content, parent_id, created_at, is_approved)
SELECT id, post_slug, username, email, rating, content, parent_id, created_at, is_approved FROM comments;

DROP TABLE comments;
ALTER TABLE comments_new RENAME TO comments;