import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your_very_secure_jwt_secret_key";

// Đăng ký người dùng mới
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra người dùng đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        message: "User with this email or username already exists",
      });
      return;
    }

    // Tạo người dùng mới
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: (error as Error).message,
    });
  }
};

// Đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Xác minh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: (error as Error).message,
    });
  }
};

// Lấy thông tin profile
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "User ID not provided in request" });
      return;
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user profile",
      error: (error as Error).message,
    });
  }
};
