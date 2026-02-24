// ============================================================================
// AUTHENTICATION CONTROLLERS
// ============================================================================

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config";
import { User } from "../models";
import { redis, cacheSet } from "../utils";
import { sendEmail } from "../services";
import { 
  RegisterRequestBody, 
  LoginRequestBody, 
  RefreshTokenRequestBody,
  CacheSession,
  VerifyOtpRequestBody,
  ResendOtpRequestBody
} from "../types";

const OTP_EXPIRY_MINUTES = 10;

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp: string): string => {
  return crypto.createHmac("sha256", CONFIG.JWT_SECRET).update(otp).digest("hex");
};

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
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
      phone,
      address,
      emailVerified: false,
      emailOtpHash: otpHash,
      emailOtpExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    });

    await user.save();

    try {
      await sendEmail(email, {
        subject: "Verify your email - Craveo",
        text: `Your OTP is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
        html: `
          <p>Your OTP is <strong>${otp}</strong>.</p>
          <p>It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        `,
      });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      res.status(500).json({ error: "Failed to send OTP email" });
      return;
    }

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
      message: "User registered. OTP sent to email.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const verifyOtp = async (
  req: Request<{}, {}, VerifyOtpRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.emailVerified) {
      res.json({ message: "Email already verified" });
      return;
    }

    if (!user.emailOtpHash || !user.emailOtpExpires) {
      res.status(400).json({ error: "OTP not generated" });
      return;
    }

    if (user.emailOtpExpires.getTime() < Date.now()) {
      res.status(400).json({ error: "OTP expired" });
      return;
    }

    const providedHash = hashOtp(otp);
    if (providedHash !== user.emailOtpHash) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    user.emailVerified = true;
    user.emailOtpHash = undefined;
    user.emailOtpExpires = undefined;
    await user.save();

    await redis.xadd(
      "auth-activity",
      "*",
      "userId",
      user._id.toString(),
      "action",
      "EMAIL_VERIFIED",
      "timestamp",
      Date.now().toString()
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

export const resendOtp = async (
  req: Request<{}, {}, ResendOtpRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.emailVerified) {
      res.json({ message: "Email already verified" });
      return;
    }

    const otp = generateOtp();
    user.emailOtpHash = hashOtp(otp);
    user.emailOtpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    await sendEmail(email, {
      subject: "Your new OTP - Craveo",
      text: `Your OTP is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      html: `
        <p>Your OTP is <strong>${otp}</strong>.</p>
        <p>It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
      `,
    });

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Failed to resend OTP" });
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

    if (user.emailVerified === false) {
      res.status(403).json({ error: "Email not verified" });
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
