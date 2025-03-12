import { inject, injectable } from "inversify";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { Err, Ok } from "@thames/monads";
import { isPast } from "date-fns";
import { Repository } from "@/dependencies/constants";
import { UserRepository } from "@/domain/gateway/UserRepository";
import { RegisterSchema } from "@/domain/schemas/registerSchema";
import { AsyncResult } from "@/types/AsyncResult";
import { AuthenticationError } from "@/domain/errors/AuthenticationError";
import { TokenSchema } from "@/domain/schemas/tokenSchema";
import { LoginSchema } from "@/domain/schemas/loginSchema";
import { stall } from "@/utils/stall";
import { DeviceSchema } from "@/domain/schemas/deviceSchema";
import { TokenType } from "@/domain/enum/TokenType";
import { TokenRepository } from "@/domain/gateway/TokenRepository";
import {
  generateAccessToken,
  generateRefreshToken,
  UserJwtPayload,
  verifyToken,
} from "@/utils/jwt";
import { ResetPasswordRepository } from "@/domain/gateway/ResetPasswordRepository";
import { PasswordUpdateSchema } from "@/domain/schemas/passwordUpdateSchema";
import { AuthService } from "@/domain/usecases/AuthService";

@injectable()
export class AuthConcreteService implements AuthService {
  constructor(
    @inject(Repository.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(Repository.TokenRepository)
    private readonly tokenRepository: TokenRepository,
    @inject(Repository.ResetPasswordRepository)
    private readonly resetPasswordRepository: ResetPasswordRepository
  ) {}

  async register(
    credentials: RegisterSchema
  ): AsyncResult<TokenSchema, AuthenticationError> {
    const existingUser = await this.userRepository.findOneByEmail(
      credentials.email
    );

    if (existingUser.isSome()) {
      return Err(AuthenticationError.EmailAlreadyExists);
    }

    const hashedPassword = await argon2.hash(credentials.password);

    try {
      const user = await this.userRepository.create({
        ...credentials,
        password: hashedPassword,
      });

      // const confirmationToken = jwt.sign(
      //   { id: user.id },
      //   env.EMAIL_CONFIRMATION_SECRET
      // );
      // TODO send emails

      const tokens = await this.generateTokens(user);

      return Ok(tokens);
    } catch (err) {
      return Err(AuthenticationError.UserCreationFailed);
    }
  }

  async login(
    credentials: LoginSchema,
    device: DeviceSchema
  ): AsyncResult<TokenSchema, AuthenticationError> {
    const timeStart = performance.now();
    const stallTime = 1000;

    const existingUser = await this.userRepository.findOneByEmail(
      credentials.email
    );

    if (existingUser.isNone()) {
      await stall(stallTime, timeStart);
      return Err(AuthenticationError.UserNotFound);
    }

    const user = existingUser.unwrap();
    const passwordMatch = await argon2.verify(
      user.password,
      credentials.password
    );

    if (!passwordMatch) {
      await stall(stallTime, timeStart);
      return Err(AuthenticationError.Unauthorized);
    }

    const tokens = await this.generateTokens(user, device);

    await stall(stallTime, timeStart);
    return Ok(tokens);
  }

  async refreshToken(
    refreshToken: string
  ): AsyncResult<TokenSchema, AuthenticationError> {
    const jwtPayloadResult = verifyToken<UserJwtPayload>(
      refreshToken,
      env.REFRESH_TOKEN_SECRET
    );

    if (jwtPayloadResult.isErr()) {
      const error = jwtPayloadResult.unwrapErr();

      if (error === AuthenticationError.TokenExpired) {
        await this.tokenRepository.delete(refreshToken);
      }

      return Err(error);
    }

    const userJwtPayload = jwtPayloadResult.unwrap();
    const foundToken = await this.tokenRepository.findOneById(refreshToken);

    if (foundToken.isNone()) {
      return Err(AuthenticationError.TokenExpired);
    }

    const token = foundToken.unwrap();

    if (token.ownedBy !== userJwtPayload.id) {
      return Err(AuthenticationError.Unauthorized);
    }

    const tokens = await this.generateTokens(userJwtPayload, {
      name: token.deviceName,
      ip: token.deviceIp,
    });

    await this.tokenRepository.delete(refreshToken);

    return Ok(tokens);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete(refreshToken);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const foundUser = await this.userRepository.findOneByEmail(email);

    if (foundUser.isNone()) {
      return;
    }

    const resetToken = jwt.sign({ email }, env.RESET_PASSWORD_SECRET, {
      expiresIn: env.RESET_PASSWORD_EXPIRATION_IN_MS,
    });

    await this.resetPasswordRepository.create({
      token: resetToken,
      user: foundUser.unwrap().id,
      expiresAt: new Date(Date.now() + env.RESET_PASSWORD_EXPIRATION_IN_MS),
    });
  }

  async resetPassword(
    resetToken: string,
    password: string
  ): AsyncResult<true, AuthenticationError> {
    const foundResetPassword =
      await this.resetPasswordRepository.findOneByToken(resetToken);

    if (foundResetPassword.isNone()) {
      return Err(AuthenticationError.TokenExpired);
    }

    const resetPassword = foundResetPassword.unwrap();

    if (isPast(resetPassword.expiresAt)) {
      return Err(AuthenticationError.TokenExpired);
    }

    const foundUser = await this.userRepository.findOneById(resetPassword.user);

    if (foundUser.isNone()) {
      return Err(AuthenticationError.UserNotFound);
    }

    const user = foundUser.unwrap();
    const newPassword = await argon2.hash(password);

    const updatedUser = await this.userRepository.update(user.id, {
      password: newPassword,
    });

    if (updatedUser.isNone()) {
      // ne devrait pas arriver
      return Err(AuthenticationError.UserNotFound);
    }

    await this.resetPasswordRepository.delete(resetPassword.id);
    return Ok(true);
  }

  async isResetPasswordTokenValid(token: string): Promise<boolean> {
    const foundResetPassword =
      await this.resetPasswordRepository.findOneByToken(token);

    if (foundResetPassword.isNone()) {
      return false;
    }

    const resetPassword = foundResetPassword.unwrap();

    if (isPast(resetPassword.expiresAt)) {
      return false;
    }

    return true;
  }

  async confirmEmail(confirmationToken: string): Promise<boolean> {
    const jwtPayloadResult = verifyToken<{ id: string }>(
      confirmationToken,
      env.EMAIL_CONFIRMATION_SECRET
    );

    if (jwtPayloadResult.isErr()) {
      return false;
    }

    const userId = jwtPayloadResult.unwrap().id;
    const foundUser = await this.userRepository.findOneById(userId);

    if (foundUser.isNone()) {
      return false;
    }

    await this.userRepository.update(userId, {
      isEmailConfirmed: true,
      confirmedAt: new Date(),
    });

    return true;
  }

  async updatePassword(
    userId: string,
    credentials: PasswordUpdateSchema
  ): AsyncResult<true, AuthenticationError> {
    const foundUser = await this.userRepository.findOneById(userId);

    if (foundUser.isNone()) {
      return Err(AuthenticationError.UserNotFound);
    }

    const user = foundUser.unwrap();
    const passwordMatch = await argon2.verify(
      user.password,
      credentials.password
    );

    if (!passwordMatch) {
      return Err(AuthenticationError.Unauthorized);
    }

    const newPassword = await argon2.hash(credentials.newPassword);

    await this.userRepository.update(userId, {
      password: newPassword,
    });

    return Ok(true);
  }

  private async generateTokens(
    user: UserJwtPayload,
    device: DeviceSchema = {}
  ): Promise<TokenSchema> {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenRepository.create({
        ownedBy: user.id,
        token: generateAccessToken({
          id: user.id,
          email: user.email,
          roles: user.roles,
        }),
        type: TokenType.AccessToken,
        scopes: user.roles,
        deviceName: device.name,
        deviceIp: device.ip,
        expiresAt: new Date(Date.now() + env.ACCESS_TOKEN_EXPIRATION_IN_MS),
      }),

      this.tokenRepository.create({
        ownedBy: user.id,
        token: generateRefreshToken({
          id: user.id,
          email: user.email,
          roles: user.roles,
        }),
        type: TokenType.RefreshToken,
        scopes: user.roles,
        deviceName: device.name,
        deviceIp: device.ip,
        expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRATION_IN_MS),
      }),
    ]);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }
}
