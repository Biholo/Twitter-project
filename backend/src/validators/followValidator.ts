import { z } from "zod";

// Validator pour suivre un utilisateur
export const followUserSchema = z.object({
  followingId: z.string().min(1, { message: "L'ID de l'utilisateur à suivre est requis." }),
});

// Validator pour les paramètres de l'URL
export const followParamsValidator = z.object({
  userId: z.string().min(1, "L'ID de l'utilisateur est requis")
});

// Validator pour les paramètres de requête (pagination)
export const followQueryValidator = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
});
