import { verifyToken } from "../utils/jwt.js";

export const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.accessToken;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new Error("Invalid token"));
    }

    // attach authenticated user
    socket.user = decoded;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};