-- Update comments table to include rating and email if they don't exist
-- Although the schema says they exist, I will ensure they are properly handled
-- and add indexes for performance.

CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments(is_approved);
