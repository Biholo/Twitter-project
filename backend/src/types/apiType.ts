import { Request } from "express";
import mongoose from "mongoose";

export interface AuthenticatedUser {
  id: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
export interface QueryParams {
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

