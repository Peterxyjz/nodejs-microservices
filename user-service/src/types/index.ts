import { Document } from "mongoose";
import { Request } from "express";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>; // Method để so sánh mật khẩu
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  userId?: string; // Mở rộng interface Request để thêm thuộc tính userId
}

export interface AppError extends Error {
  statusCode?: number;
}
