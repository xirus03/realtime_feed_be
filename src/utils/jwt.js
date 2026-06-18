import jwt from "jsonwebtoken";

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const refreshToken = (token) => {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};