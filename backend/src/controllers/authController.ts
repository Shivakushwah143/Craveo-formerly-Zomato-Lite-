// ============================================================================
// AUTHENTICATION CONTROLLERS
// ============================================================================

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config";
import { User } from "../models";
import { redis, cacheSet } from "../utils";
import { 
  RegisterRequestBody, 
  LoginRequestBody, 
  RefreshTokenRequestBody,
  CacheSession 
} from "../types";

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      phone,
      address,
    });

    await user.save();

    await redis.xadd(
      "auth-activity",
      "*",
      "userId",
      user._id.toString(),
      "action",
      "REGISTER",
      "timestamp",
      Date.now().toString()
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      CONFIG.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id.toString() }, 
      CONFIG.JWT_REFRESH_SECRET, 
      { expiresIn: "7d" }
    );

    await cacheSet<CacheSession>(
      `user:${user._id}:session`,
      { accessToken, refreshToken },
      3600
    );

    await redis.xadd(
      "auth-activity",
      "*",
      "userId",
      user._id.toString(),
      "action",
      "LOGIN",
      "timestamp",
      Date.now().toString()
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const refreshToken = async (
  req: Request<{}, {}, RefreshTokenRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, CONFIG.JWT_REFRESH_SECRET) as {
      id: string;
    };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      CONFIG.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};