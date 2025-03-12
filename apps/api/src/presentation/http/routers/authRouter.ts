import { getInstance } from "@/dependencies/container";
import { AuthController } from "@/presentation/http/controllers/AuthController";
import { Router } from "express";

export function authRouter(): Router {
  const router = Router();
  const authController = getInstance(AuthController);

  return router;
}
