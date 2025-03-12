import { env } from "@/env";
import { RequestHandler } from "express";
import { AuthenticationError } from "@/domain/errors/AuthenticationError";
import { UserJwtPayload, verifyToken } from "@/utils/jwt";

export const USER_HEADER_NAME = "x-user-internal";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const TOKEN_PREFIX = "Bearer ";
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(403).send(AuthenticationError.AuthorizationNotFound);
    return;
  }

  if (!authorization.startsWith(TOKEN_PREFIX)) {
    res.status(403).send(AuthenticationError.UnsupportedIdentifier);
    return;
  }

  const token = authorization.slice(TOKEN_PREFIX.length);
  const jwtPayloadResult = verifyToken<UserJwtPayload>(
    token,
    env.ACCESS_TOKEN_SECRET
  );

  if (jwtPayloadResult.isErr()) {
    const errorType = jwtPayloadResult.unwrapErr();
    res.status(403).send(errorType);
    return;
  }

  req.headers[USER_HEADER_NAME] = JSON.stringify(jwtPayloadResult.unwrap());

  next();
};
