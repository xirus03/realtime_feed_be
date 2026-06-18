import * as Posts from "../db/queries/post.queries.js";

/**
 * Creates a new post.
 * @param {number} userId - The ID of the user creating the post.
 * @param {string} content - The content of the post.
 * @returns {Promise<Object>} - A promise resolving to the created post.
 */
export const createPost = async (userId, content) => {
  if (!content.trim()) {
    throw new Error("Post content required");
  }

  return Posts.createPost(userId, content.trim());
};

/**
 * Fetch posts with user info, like count, and comment count
 * @param {number} limit - The maximum number of posts to return.
 * @returns {Promise<Array>} - A promise resolving to an array of posts with user info, like count, and comment count.
 */
export const getFeed = async ({cursor, limit}) => {
  const parsedLimit = Math.min(parseInt(limit) || 20, 50); // default to 20, max 50

  return Posts.getFeed({
    cursor, 
    limit: parsedLimit,
  });
};

/**
 * Retrieves a post by its ID.
 * @param {number} postId - The ID of the post to retrieve.
 * @returns {Promise<Object>} - A promise resolving to the retrieved post.
 */
export const getPostById = async (postId) => {
  return Posts.getPostById(postId);
}