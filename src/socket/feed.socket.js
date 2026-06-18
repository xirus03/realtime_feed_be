import * as PostsService from "../services/post.service.js";
import { sanitizeContent } from "../utils/sanitize.js";

const registerFeedEvents = (io, socket) => {
  // user creates post
  socket.on("post:create", async (data) => {
    try {
      const content = data.content;
      const tempId = data.tempId; // temporary ID from client for optimistic UI 

      if (!content) {
        return socket.emit("error", {
          message: "Content is required"
        });
      }

      const safeContent = sanitizeContent(content);

      const savedPost = await PostsService.createPost(
        socket.user.id,
        safeContent
      );

      const payload = {
        ...savedPost,
        username: socket.user.username,
        tempId, // include tempId so client can reconcile
      };

      // broadcast to everyone
      io.emit("feed:new-post", payload);
    } catch (error) {
      socket.emit("error", {
        message: error.message,
      });
    }
  });
};

export default registerFeedEvents;