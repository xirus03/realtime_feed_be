export const createConversation = async (userIds, type = "direct", name = null) => {
    // create conversation in DB and return conversation details
    const query = `
        INSERT INTO conversations (type, name)
        VALUES ($1, $2)
        RETURNING id, type, name, created_at
    `;
  
    const result = await db.query(query, [type, name]);
    const conversation = result.rows[0];

    // associate users with conversation
    const userConversationQuery = `
      INSERT INTO user_conversations (user_id, conversation_id)
      VALUES ($1, $2)
    `;

    // Associate each user with the conversation
    for (const userId of userIds) {
      await db.query(userConversationQuery, [userId, conversation.id]);
    }
    return conversation;
};

export const createMessage = async (conversationId, senderId, content) => {
    // create message in DB and return message details
    const query = `
        INSERT INTO messages (conversation_id, sender_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, conversation_id, sender_id, content, created_at
    `;
    const result = await db.query(query, [conversationId, senderId, content]);
    return result.rows[0];
};

export const getConversationMessages = async (conversationId) => {
    // fetch messages for a conversation from DB
};

export const getUserConversations = async (userId) => {
    // fetch conversations for a user from DB
};
