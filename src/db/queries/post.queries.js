import db from "../index.js";

/**
 * Creates a new post.
 * @param {number} userId - The ID of the user creating the post.
 * @param {string} content - The content of the post.
 * @returns {Promise<Object>} - A promise resolving to the created post.
 */
export const createPost = async (userId, content) => {
  const result = await db.query(
    `
    INSERT INTO posts (user_id, content)
    VALUES ($1, $2)
    RETURNING id, user_id, content, created_at
    `,
    [userId, content]
  );

  return result.rows[0];
};

/**
 * Fetch posts with user info, like count, and comment count
 * @param {number} limit - The maximum number of posts to return.
 * @returns {Promise<Array>} - A promise resolving to an array of posts with user info, like count, and comment count.
 * [
 *   { id, content, created_at, user_id, username, like_count, comment_count },
 *   ...
 * ] 
 */
export const getFeed = async ({cursor, limit = 50}) => {
  const values = [limit];

  let query = `
    SELECT
      p.id,
      p.content,
      p.created_at,
      u.username
    FROM posts p
    JOIN users u ON u.id = p.user_id
  `;

  // cursor condition
  if (cursor) {
    values.push(cursor);
    query += `
      WHERE p.created_at < $2
    `;
  }

  query += `
    ORDER BY p.created_at DESC
    LIMIT $1
  `;

  const result = await db.query(query, values);
  return result.rows;
};

/**
 * Fetch posts created before a certain timestamp for pagination.
 * @param {string} timestamp - The timestamp to fetch posts before (ISO format).  
 * @param {number} limit - The maximum number of posts to return.
 * @returns {Promise<Array>} - A promise resolving to an array of posts.
 */
export const getPostBefore = async (timestamp, limit = 20) => {
  const result = await db.query(
    `
    SELECT *
    FROM posts
    WHERE created_at < $1
    ORDER BY created_at DESC
    LIMIT $2
    `,
    [timestamp, limit]
  );

  return result.rows;
};

/**
 * Fetch a post by its ID.
 * @param {number} postId - The ID of the post to retrieve.
 * @returns {Promise<Object>} - A promise resolving to the retrieved post.
 */
export const getPostById = async (postId) => {
  const result = await db.query(
    `
    SELECT *
    FROM posts
    WHERE id = $1
    `,
    [postId]
  );

  return result.rows[0];
};