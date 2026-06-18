import * as AuthService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email and password are required" });
    }

    const result = await AuthService.register(username, email, password);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Call the login function from the AuthService
    const result = await AuthService.login(email, password);

    // Set the token in an HTTP-only cookie
    res.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
};