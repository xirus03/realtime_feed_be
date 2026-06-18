CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,

  user_id BIGINT NOT NULL,
  content TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  -- Foreign key relationship
  CONSTRAINT fk_posts_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Feed performance index
CREATE INDEX IF NOT EXISTS idx_posts_created_at
ON posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_user_id
ON posts(user_id);