CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_slug TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER DEFAULT 0,
  content TEXT NOT NULL,
  parent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_approved INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved);
