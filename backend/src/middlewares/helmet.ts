import helmet from 'helmet';

/**
 * Middleware pour sécuriser l'application en définissant divers en-têtes HTTP.
 * Vous pouvez ajuster la configuration de helmet selon vos besoins.
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: false,
}); 