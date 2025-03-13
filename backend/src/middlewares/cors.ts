import cors from 'cors';

/**
 * Middleware pour configurer le CORS de l'application.
 * Vous pouvez définir l'origine autorisée via une variable d'environnement ou en dur.
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // En développement, autoriser toutes les origines
    // En production, vous devriez restreindre cela à des origines spécifiques
    callback(null, true);
    
    // Version précédente avec liste d'origines spécifiques
    /*
    // Autoriser les requêtes sans origine (comme les requêtes de Postman)
    if (!origin) return callback(null, true);
    
    // Liste des origines autorisées
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:64921' // Origine de l'aperçu du navigateur
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
    */
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});