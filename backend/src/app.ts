import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { corsMiddleware } from "@/middlewares/cors";
import { securityHeaders } from "@/middlewares/helmet";
import { limiter } from "@/middlewares/rateLimit";
import { httpLogger } from "@/middlewares/httpLogger";
import { registerRoutes } from "@/routes/registerRoutes"; // Ajouter l'import
import { errorHandler } from "@/middlewares/errorHandler";
import { logger } from "@/middlewares/logger";
import dotenv from "dotenv";
import connect from "@/config/conn";
import { loadFixtures } from "@/fixtures/fixtures";
import minioService from "@/services/minioService";

dotenv.config();

export async function createExpressApp() {
  const app = express();
  await minioService.initialize();
  connect();

  app.use(express.json());
  app.use(securityHeaders);
  app.use(corsMiddleware);
  app.use(httpLogger);
  app.use(limiter);

  registerRoutes(app);
 
  setupErrorMiddleware(app);

  loadFixtures();
  
  return app;
}

function setupErrorMiddleware(app: Express) {
  app.use((req, res) => {
    logger.error(`Route non trouvée: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: "Route non trouvée." });
  });

  // Middleware global pour la gestion des erreurs
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });
}
