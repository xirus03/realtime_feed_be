import * as PostsService from "../services/post.service.js";

const registerFeedEvents = (io, socket) => {
  // user creates post
  socket.on("post:create", async (data) => {
    try {
      const content = data.content;
      const tempId = data.tempId; // temporary ID from client for optimistic UI 

      const savedPost = await PostsService.createPost(
        socket.user.id,
        content
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