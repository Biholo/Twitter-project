import cors from 'cors';

/**
 * Middleware pour configurer le CORS de l'application.
 * Vous pouvez définir l'origine autorisée via une variable d'environnement ou en dur.
 */
export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}); 