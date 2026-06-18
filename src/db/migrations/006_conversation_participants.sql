CREATE TABLE conversation_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES conversations(id),
  user_id INT REFERENCES users(id),
  UNIQUE(conversation_id, user_id)
);