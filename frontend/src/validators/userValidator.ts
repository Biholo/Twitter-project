import { z } from "zod";

export const updateUserSchema = z.object({
    username: z
      .string()
      .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères")
      .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères")
      .optional(),
  
    identifier_name: z
      .string()
      .regex(/^[a-z0-9_-]+$/, "L'identifiant ne peut contenir que des lettres minuscules, des chiffres, des tirets (-) et des underscores (_)")
      .min(2, "L'identifiant doit contenir au moins 2 caractères")
      .max(30, "L'identifiant ne peut pas dépasser 30 caractères")
      .optional(),
  
    email: z
      .string()
      .email("Format d'email invalide")
      .optional(),
  
    bio: z
      .string()
      .max(160, "La bio ne peut pas dépasser 160 caractères")
      .optional(),
  
    accept_notifications: z
      .boolean()
      .optional(),
  
    website_link: z
      .string()
      .url("L'URL du site web n'est pas valide")
      .or(z.literal(""))
      .nullable()
      .optional(),
  });

  export type UpdateUserForm = z.infer<typeof updateUserSchema>;
