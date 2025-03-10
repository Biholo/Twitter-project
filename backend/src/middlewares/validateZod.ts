import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware générique pour la validation avec Zod.
 * @param schema - Schéma Zod à appliquer.
 * @param property - Propriété de la requête à valider (body, query, ou params).
 */
export const validateZod = (schema: ZodSchema, property: "body" | "query" | "params") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req[property]); // Par défaut, parse lance une exception en cas d'erreur
      next();
    } catch (error: any) {
      res.status(400).json({
        message: "Données invalides.",
        errors: error.errors, // Zod renvoie un tableau des erreurs
      });
    }
  };
};