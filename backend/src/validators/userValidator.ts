import { z } from 'zod';
import { roles } from '@/config/role';


/**
 * Validator for updating user details.
 * Validates data when updating user information.
 */
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

  avatar: z
    .string()
    .url("L'URL de l'avatar n'est pas valide")
    .nullable()
    .optional(),

  banner_photo: z
    .string()
    .url("L'URL de la photo de bannière n'est pas valide")
    .nullable()
    .optional(),

  roles: z
    .array(z.enum(roles as [string, ...string[]]))
    .optional(),

  website_link: z
    .string()
    .url("L'URL du site web n'est pas valide")
    .nullable()
    .optional(),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
    .optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour"
});

/**
 * Validator for filtering users.
 * Validates data when querying users.
 */
export const filterUserSchema = z.object({
  role: z
    .enum(roles as [string, ...string[]])
    .optional(),
  email: z

    .string()
    .email("Format d'email invalide")
    .optional(),
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .optional(),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .optional(),
  isActive: z
    .boolean()
    .optional(),
  createdAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2})?$/, "Format de date invalide (YYYY-MM-DD,YYYY-MM-DD)")
    .optional(),
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2})?$/, "Format de date invalide (YYYY-MM-DD,YYYY-MM-DD)")
    .optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'firstName', 'lastName', 'email'])
    .optional()
    .default('createdAt'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  page: z
    .number()
    .min(1, "La page doit être supérieure à 0")
    .optional()
    .default(1),
  limit: z
    .number()
    .min(1, "La limite doit être supérieure à 0")
    .max(100, "La limite ne peut pas dépasser 100")
    .optional()
    .default(10)
});

export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "L'ID doit être un ID MongoDB valide")
});


export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type FilterUserData = z.infer<typeof filterUserSchema>;
export type IdParamSchema = z.infer<typeof idParamSchema>;
