import pool from '../index.js';

export const createUser = async (username, email, password) => {
    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, password]
    );
    return result.rows[0];
}

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
}

export const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

export const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
}

export const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

export const update = async (id, username, email, password) => {
    const result = await pool.query(
        'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
        [username, email, password, id]
    );
    return result.rows[0];
}

export const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}

export const findUserByUsernameOrEmail = async (username, email) => {
    const result = await pool.query(
        'SELECT id, username, email FROM users WHERE username = $1 OR email = $2 limit 10',
        [username, email]
    );
    return result.rows;
}

export const updateRefreshToken = async (id, refreshToken) => {
    const result = await pool.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *',
        [refreshToken, id]
    );
    return result.rows[0];
}