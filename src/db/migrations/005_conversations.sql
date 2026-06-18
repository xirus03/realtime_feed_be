CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) DEFAULT 'direct', -- 'direct' or 'group'
  name VARCHAR(255) NULL, -- for group conversations
  created_at TIMESTAMP DEFAULT NOW()
);