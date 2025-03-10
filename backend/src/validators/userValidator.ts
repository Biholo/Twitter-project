import { z } from 'zod';
import { roles } from '@/config/role';


/**
 * Validator for updating user details.
 * Validates data when updating user information.
 */
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .optional(),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .optional(),
  phone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
    .max(15, "Le numéro de téléphone ne peut pas dépasser 15 chiffres")
    .optional(),
  email: z
    .string()
    .email("Format d'email invalide")
    .optional(),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
    .optional(),
  role: z
    .enum(["admin", "employé", "client"])
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


export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type FilterUserData = z.infer<typeof filterUserSchema>;
