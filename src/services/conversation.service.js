import db from "../db/index.js";

/**
 * Find an existing direct conversation between two users
 */
export const findDirectConversation = async (userA, userB) => {
  const query = `
    SELECT uc1.conversation_id
    FROM conversation_participants uc1
    JOIN conversation_participants uc2
      ON uc1.conversation_id = uc2.conversation_id
    JOIN conversations c
      ON c.id = uc1.conversation_id
    WHERE c.type = 'direct'
      AND uc1.user_id = $1
      AND uc2.user_id = $2
    LIMIT 1
  `;

  const result = await db.query(query, [userA, userB]);

  return result.rows[0]?.conversation_id || null;
};

/**
 * Create a new conversation and attach users
 */
export const createConversation = async (
  userIds,
  type = "direct",
  name = null
) => {
  const query = `
    INSERT INTO conversations (type, name)
    VALUES ($1, $2)
    RETURNING id, type, name, created_at
  `;

  const result = await db.query(query, [type, name]);
  const conversation = result.rows[0];

  const insertQuery = `
    INSERT INTO conversation_participants (user_id, conversation_id)
    VALUES ($1, $2)
  `;

  // add all participants
  for (const userId of userIds) {
    await db.query(insertQuery, [userId, conversation.id]);
  }

  return conversation;
};

/**
 * MAIN FUNCTION:
 * Find existing DM OR create new one
 */
export const findOrCreateDirectConversation = async (userId, receiverUserId) => {
  // 1. check if DM already exists
  const existingConversationId = await findDirectConversation(userId, receiverUserId);

  if (existingConversationId) {
    return existingConversationId;
  }

  // 2. create new conversation
  const conversation = await createConversation(
    [userId, receiverUserId],
    "direct",
    null
  );

  return conversation.id;
};

/**
 * Create a message
 */
export const createMessage = async (conversationId, senderId, content) => {
  // const query = `
  //   INSERT INTO messages (conversation_id, sender_id, content)
  //   VALUES ($1, $2, $3)
  //   RETURNING id, conversation_id, sender_id, content, created_at
  // `;

  const query = `
      WITH inserted AS (
        INSERT INTO messages (conversation_id, sender_id, content)
        VALUES ($1, $2, $3)
        RETURNING *
      )
      SELECT
        inserted.id,
        inserted.content,
        inserted.created_at,
        c.id AS conversation_id,
        u.id AS sender_id,
        u.username AS username
      FROM inserted
      JOIN conversations c ON c.id = inserted.conversation_id
      JOIN users u ON u.id = inserted.sender_id;
      `;

  const result = await db.query(query, [conversationId, senderId, content]);

  return result.rows[0];
};

/**
 * Get messages for a conversation
 */
export const getConversationMessages = async (conversationId) => {
  const query = `
    SELECT m.id, m.conversation_id, m.sender_id, m.content, m.created_at,
           u.username
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    WHERE m.conversation_id = $1
    ORDER BY m.created_at ASC
  `;

  const result = await db.query(query, [conversationId]);

  return result.rows;
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId) => {
  const query = `
    SELECT c.id, c.type, c.name, u.username, c.created_at
    FROM conversations c
    JOIN conversation_participants uc ON uc.conversation_id = c.id
    JOIN users u ON u.id = (
      SELECT user_id
      FROM conversation_participants
      WHERE conversation_id = c.id
      AND user_id != $1
      limit 1
    )
    WHERE uc.user_id = $1
    ORDER BY c.created_at DESC
  `;

  const result = await db.query(query, [userId]);

  return result.rows;
};

export const getConversationName = async (conversationId, userId) => {
  const query = `
    SELECT c.name, u.username
    FROM conversations c
    LEFT JOIN conversation_participants cp ON cp.conversation_id = c.id
    LEFT JOIN users u ON u.id = cp.user_id
    WHERE c.id = $1
    AND u.id != $2
  `;
  const result = await db.query(query, [conversationId, userId]);
  return result.rows[0] || null;
};
