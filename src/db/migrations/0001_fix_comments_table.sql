CREATE TABLE IF NOT EXISTS comments_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER,
  content TEXT NOT NULL,
  parent_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments_new (id, post_slug, username, email, rating, content, parent_id, created_at)
SELECT id, post_slug, username, email, rating, content, parent_id, COALESCE(created_at, CURRENT_TIMESTAMP)
FROM comments;

DROP TABLE comments;
ALTER TABLE comments_new RENAME TO comments;
