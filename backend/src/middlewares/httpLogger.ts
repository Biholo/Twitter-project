import pinoHttp from 'pino-http';
import { logger } from './logger';

/**
 * Middleware HTTP pour Express, qui journalise automatiquement
 * toutes les requêtes entrantes et les réponses associées.
 */
export const httpLogger = pinoHttp({ logger });