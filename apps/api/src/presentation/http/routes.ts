import { Express, Router, Request, Response, NextFunction } from "express";
import { authRouter } from "@/presentation/http/routers/authRouter";
import { isHttpError } from "@/domain/errors/HtppError";

export function setupRoutes(app: Express): void {
  const apiRouter = Router();

  app.use("/api", apiRouter);

  registerRoutes(apiRouter);
  registerErrorHandlers(app);
}

function registerRoutes(router: Router): void {
  router.use("/auth", authRouter());
}

function registerErrorHandlers(app: Express): void {
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (isHttpError(err)) {
      res.status(err.statusCode).json({ error: err.message });
      return next();
    }

    res.status(500).json({ error: "Internal server error" });
    next();
  });
}
