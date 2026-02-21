-- src/db/migrations/0002_fix_comments_table.sql
DROP TABLE IF EXISTS comments;

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  post_slug TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER DEFAULT 0,
  content TEXT NOT NULL,
  parent_id TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_approved INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
