import { Document } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: Date;
}

export interface AppError extends Error {
  statusCode?: number;
}
