import { User } from "./userType";

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }

  export interface ApiLoginResponse {
    access_token: string;
    refresh_token: string;
  }

  export interface UserData {
    message: string;
    user: User;
  }
  
export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
  }