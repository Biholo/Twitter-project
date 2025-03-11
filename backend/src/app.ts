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

// Import des routes 
import { authRoutes } from "@/routes/authRoutes";
import { followRoutes } from "@/routes/followRoutes"; // Import des routes de follow

dotenv.config();

export function createExpressApp() {
  const app = express();
  connect();

  app.use(express.json());
  app.use(securityHeaders);
  app.use(corsMiddleware);
  app.use(httpLogger);
  app.use(limiter);

  // Enregistrer les routes
  app.use("/auth", authRoutes());
  app.use("/follow", followRoutes());
 
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
