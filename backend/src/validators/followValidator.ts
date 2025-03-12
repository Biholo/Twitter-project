import { z } from "zod";

// Validator pour suivre un utilisateur
export const followUserSchema = z.object({
  followingId: z.string().min(1, { message: "L'ID de l'utilisateur à suivre est requis." }),
});
