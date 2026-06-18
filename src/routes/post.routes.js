import express from "express";
import * as PostsController from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", PostsController.getFeed);
router.get("/:id", PostsController.getPostById);
router.post("/", authMiddleware, PostsController.createPost);

export default router;