import * as ConversationService from "../services/conversation.service.js";

export default function registerConversationEvents(io, socket) {
  const userId = socket.user.id;

  // personal room
  socket.join(`user:${userId}`);

  /**
   * Join conversation room
   */
  socket.on("conversation:join", ({ conversationId }) => {
    socket.join(`conversation:${conversationId}`);
  });

  /**
   * Send message
   */
  socket.on("conversation:send", async (data) => {
    try {
      const { conversationId, content, receiverId } = data;

      const message = await ConversationService.createMessage(
        conversationId,
        userId,
        content,
      );

      // broadcast to conversation room
      io.to(`conversation:${conversationId}`).emit(
        "conversation:new-message",
        message
      );

      // notify receiver (optional)
      io.to(`user:${receiverId}`).emit(
        "conversation:notification",
        message
      );
    } catch (err) {
      console.error("Conversation error:", err.message);
    }
  });
}