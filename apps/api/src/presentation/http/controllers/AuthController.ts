import { inject, injectable } from "inversify";
import { Response } from "express";
import { registerSchema } from "@/domain/schemas/registerSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { Service } from "@/dependencies/constants";
import { AuthService } from "@/domain/usecases/AuthService";
import { AuthenticationError } from "@/domain/errors/AuthenticationError";

@injectable()
export class AuthController {
  constructor(
    @inject(Service.AuthService)
    private readonly authService: AuthService
  ) {}

  public register = asyncHandler({
    bodySchema: registerSchema,
    handler: async (req, res) => {
      const registrationResult = await this.authService.register(req.body);

      if (registrationResult.isErr()) {
        const error = registrationResult.unwrapErr();
        this.handleAuthenticationError(error, res);
        return;
      }

      res.status(201).json(registrationResult.unwrap());
    },
  });

  private handleAuthenticationError = (
    error: AuthenticationError,
    res: Response
  ): Response => {
    switch (error) {
      case AuthenticationError.EmailAlreadyExists:
      case AuthenticationError.AuthorizationNotFound:
      case AuthenticationError.Unauthorized:
      case AuthenticationError.UserNotFound:
        // avoid leaking information about existing users
        // alternative: captcha on the frontend
        return res.status(403).send("Unauthorized");
      case AuthenticationError.UnsupportedIdentifier:
        return res.status(400).send("Unsupported identifier");
      case AuthenticationError.UserCreationFailed:
        return res.status(500).send("User creation failed");
      case AuthenticationError.TokenExpired:
        return res.status(403).send("TokenExpired");
    }
  };
}
