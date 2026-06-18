import * as ConversationService from "../services/conversation.service.js";

/**
 * Open or create a DM conversation
 */
export const openDirectMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userId:receiverUserId } = req.body;

    const conversationId =
      await ConversationService.findOrCreateDirectConversation(
        userId,
        receiverUserId
      );

    return res.json({ conversationId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await ConversationService.getUserConversations(userId);

    return res.json({
      length: conversations.length,
      conversations,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Create group conversation (optional existing logic)
 */
export const createGroupConversation = async (req, res) => {
  try {
    const { userIds, name } = req.body;

    const conversation = await ConversationService.createConversation(
      userIds,
      "group",
      name
    );

    return res.json(conversation);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const conversationName = await ConversationService.getConversationName(conversationId, userId);
    if (!conversationName) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await ConversationService.getConversationMessages(conversationId);

    return res.json({ 
      length: messages.length, 
      messages,
      conversationName: conversationName.name || conversationName.username // for DMs, show the other user's name
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};