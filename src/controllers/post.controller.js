
import * as PostsService from "../services/post.service.js";
import { pubClient } from "../lib/redis.js";

const FEED_CACHE_PREFIX = "feed:v1";

/**
 * Creates a new post.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns {Promise<void>}
 */
export const createPost = async (req, res) => {
  try {
    const post = await PostsService.createPost({
      userId: req.user.id,
      content: req.body.content,
    });

    // Invalidate all first page feed caches since a new post has been added
    const keys = await pubClient.keys("feed:v1:first:*");

    if(keys.length > 0) {
      await pubClient.del(keys);
    }

    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/** Retrieves a paginated feed of posts.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns {Promise<void>}
 */
export const getFeed = async (req, res) => {
  try {
    const {cursor, limit = 10} = req.query;

    // Try to serve from cache if it's the first page
    if (!cursor) {
      const cacheKey = `${FEED_CACHE_PREFIX}:first:${limit}`;
      const cachedData = await pubClient.get(cacheKey);

      // If we have cached data, return it immediately
      if (cachedData) {
        return res.json({
          source: "redis",
          data: JSON.parse(cachedData),
          nextCursor: JSON.parse(cachedData).at(-1)?.id || null,
        });
      }

      // If no cache, fetch from database and cache the result
      const posts = await PostsService.getFeed({
        cursor: null,
        limit: Number(limit),
      });

      await pubClient.set(cacheKey, JSON.stringify(posts), {
        EX: 30, // Cache for 30 seconds
      });

      return res.json({
        source: "database",
        data: posts,
        nextCursor: posts.length > 0 ? posts[posts.length - 1].id : null,
      });
    }

    // Paginated requests (with cursor) are always served from the database
    const posts = await PostsService.getFeed({
      cursor,
      limit: Number(limit),
    });

    return res.json({
      source: "database",
      data: posts,
      nextCursor: posts.length > 0 ? posts[posts.length - 1].id : null,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** Retrieves a post by its ID.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns {Promise<void>}
 */
export const getPostById = async (req, res) => {
  try {
    const cacheKey = `post:${req.params.id}`;
    const cachedPost = await pubClient.get(cacheKey);

    // If post is in cache, return it immediately
    if (cachedPost) {
      return res.json({
        source: "redis",
        data: JSON.parse(cachedPost),
      });
    }

    // If not in cache, fetch from database and cache the result
    const post = await PostsService.getPostById(req.params.id);
    await pubClient.set(cacheKey, JSON.stringify(post), {
      EX: 30, // Cache for 30 seconds
    });

    return res.json({
      source: "database",
      data: post,
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};