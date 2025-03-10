import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères"),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères"),
  role: z
    .enum(["admin", "employé", "client"])
    .optional(),
});

export const refreshTokenSchema = z.object({
  token: z
    .string()
    .min(1, "Le token de rafraîchissement est requis"),
});

export const logoutSchema = z.object({
  token: z
    .string()
    .min(1, "Le token de rafraîchissement est requis pour la déconnexion"),
});

export const addOrRemoveFromListeSchema = z.object({
  opportunity_id: z.string().min(1),
});

export const updatePasswordSchema = z.object({
  old_password: z.string().min(1),
  new_password: z.string().min(1),
});

export const tokenSchema = z.object({
  token: z.string().min(1),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(1),
});

export const requestResetPasswordSchema = z.object({
  email: z.string().email(),
});


export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RefreshTokenData = z.infer<typeof refreshTokenSchema>;
export type LogoutData = z.infer<typeof logoutSchema>;
export type AddOrRemoveFromListeData = z.infer<typeof addOrRemoveFromListeSchema>;
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;
export type TokenData = z.infer<typeof tokenSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type RequestResetPasswordData = z.infer<typeof requestResetPasswordSchema>;

