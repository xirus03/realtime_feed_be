CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,

  user_id BIGINT NOT NULL,
  post_id BIGINT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  -- relationships
  CONSTRAINT fk_likes_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_likes_post
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE,

  -- prevent duplicate likes
  CONSTRAINT unique_user_post_like
    UNIQUE (user_id, post_id)
);

-- query optimization indexes
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);