import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connect from "./src/config/conn"; // Alias @/ fonctionne ici
import { limiter } from "./src/middlewares/rateLimit";
import { errorHandler } from "./src/middlewares/errorHandler";
import { logger } from "./src/middlewares/logger";

import { securityHeaders } from './src/middlewares/helmet';
import { corsMiddleware } from './src/middlewares/cors';
import { httpLogger } from './src/middlewares/httpLogger';
import { loadFixtures } from "./src/fixtures/fixtures";


dotenv.config();

const app: Application = express();


// Middlewares globaux
app.use(express.json());

// Middleware de sécurité, CORS, logger; transformRequestKeys et rate limiting
app.use(securityHeaders);
app.use(corsMiddleware);
// app.use(httpLogger);
app.use(limiter);



// Connexion à MongoDB
connect();

if (process.env.LOAD_FIXTURES === "true") {
  loadFixtures();
}

// Importation des routes
import userRoutes from './src/routes/userRoutes';
import authRoutes from './src/routes/authRoutes';




// Utilisation des routes avec préfixes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


// Gestion des erreurs 404
app.use((req: Request, res: Response) => {
  logger.error(`Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route non trouvée." });
});

// Middleware global pour la gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur http://localhost:${PORT}`);
});
