import { Router } from "express";

import authRoutes from "./auth.routes.js";
import usersRoutes from "./user.routes.js";
import postroutes from "./post.routes.js";
import conversationRoutes from "./conversation.routes.js";


const router = Router();

// API registry (manual = secure + explicit)
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/posts", postroutes);
router.use("/conversations", conversationRoutes);

export default router;