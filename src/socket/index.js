import registerFeedEvents from "./feed.socket.js";
import registerConversationEvents from "./conversation.socket.js";

const registerSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.user.username}`);

    // join private room using user id
    socket.join(`user:${socket.user.id}`);

    // register feature events
    registerFeedEvents(io, socket);
    registerConversationEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.user.username}`);
    });
  });
};

export default registerSocketEvents;