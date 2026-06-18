import * as Users from "../db/queries/user.queries.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { refreshToken, signToken } from "../utils/jwt.js";

export const register = async (username, email, password) => {
  const existingByUsername = await Users.findUserByUsername(username);

  if (existingByUsername) {
    throw new Error("User already exists");
  }

  const existingByEmail = await Users.findUserByEmail(email);

  if (existingByEmail) {
    throw new Error("Email already in use");
  }

  const passwordHash = await hashPassword(password);

  const user = await Users.createUser(username, email, passwordHash);

  const accessToken = signToken({ id: user.id, username: user.username });

  return { user, accessToken };
};

export const login = async (email, password) => {
  const user = await Users.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signToken({ id: user.id, username: user.username });
  const refreshToken = refreshToken({ id: user.id, username: user.username });

  // Store refresh token in DB
  await Users.updateRefreshToken(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      username: user.username,
    },
    accessToken,
    refreshToken,
  };
};