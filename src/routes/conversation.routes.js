import express from "express";
import * as ConversationController from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/dm", authMiddleware, ConversationController.openDirectMessage);
router.get("/:id/messages", authMiddleware, ConversationController.getConversationMessages);
router.get("/", authMiddleware, ConversationController.getUserConversations);

export default router;