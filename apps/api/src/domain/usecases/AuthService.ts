import { AuthenticationError } from "@/domain/errors/AuthenticationError";
import { DeviceSchema } from "@/domain/schemas/deviceSchema";
import { LoginSchema } from "@/domain/schemas/loginSchema";
import { PasswordUpdateSchema } from "@/domain/schemas/passwordUpdateSchema";
import { RegisterSchema } from "@/domain/schemas/registerSchema";
import { TokenSchema } from "@/domain/schemas/tokenSchema";
import { AsyncResult } from "@/types/AsyncResult";

export interface AuthService {
  register(
    credentials: RegisterSchema
  ): AsyncResult<TokenSchema, AuthenticationError>;
  login(
    credentials: LoginSchema,
    device: DeviceSchema
  ): AsyncResult<TokenSchema, AuthenticationError>;
  refreshToken(
    refreshToken: string
  ): AsyncResult<TokenSchema, AuthenticationError>;
  logout(refreshToken: string): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(
    resetToken: string,
    password: string
  ): AsyncResult<true, AuthenticationError>;
  isResetPasswordTokenValid(token: string): Promise<boolean>;
  confirmEmail(confirmationToken: string): Promise<boolean>;
  updatePassword(
    userId: string,
    credentials: PasswordUpdateSchema
  ): AsyncResult<true, AuthenticationError>;
}
