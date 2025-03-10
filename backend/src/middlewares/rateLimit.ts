import { Request, Response, NextFunction } from "express";
import rateLimit from 'express-rate-limit';
import RedisStore, { RedisReply } from 'rate-limit-redis';
import Redis from 'ioredis';

interface RequestLimits {
  [key: string]: {
    count: number;
    timestamp: number;
  };
}

const requestLimits: RequestLimits = {};

const environment = process.env.NODE_ENV || 'development';

let store;

if (environment === 'production') {
  // En production, on utilise Redis pour le rate limiting
  const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost', // à ajuster selon votre environnement Docker
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  });

  store = new RedisStore({
    sendCommand: async (command: string, ...args: string[]): Promise<RedisReply> => {
      const result = await redisClient.call(command, ...args);
      return result as RedisReply;
    }
  });
} else {
  // En environnement de développement/local, on peut utiliser le store en mémoire fourni par défaut
  store = undefined; // Cela utilisera l'implémentation en mémoire intégrée
}

export const limiter = rateLimit({
  store,
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Limite à 100 requêtes par IP par fenêtre
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});

/**
 * Middleware to limit the number of requests per IP address within a time window.
 * @param maxRequests - Maximum number of requests allowed.
 * @param windowMs - Time window in milliseconds.
 * @returns An Express middleware function for rate limiting.
 */
export const createRateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Extract IP address; fallback if req.ip is undefined
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";

    if (typeof ip !== "string") {
      res.status(500).json({ message: "Unable to determine IP address." });
      return;
    }

    const currentTime = Date.now();

    // Initialize request limits for new IPs
    if (!requestLimits[ip]) {
      requestLimits[ip] = { count: 1, timestamp: currentTime };
    } else {
      const timeDifference = currentTime - requestLimits[ip].timestamp;

      // Check if within the time window
      if (timeDifference < windowMs) {
        requestLimits[ip].count += 1;

        if (requestLimits[ip].count > maxRequests) {
          res.status(429).json({ message: "Too many requests. Please try again later." });
          return;
        }
      } else {
        // Reset the count and timestamp if outside the time window
        requestLimits[ip] = { count: 1, timestamp: currentTime };
      }
    }

    next(); // Proceed to the next middleware or route
  };
};
