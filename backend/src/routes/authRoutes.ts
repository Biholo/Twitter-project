import express from "express";
import {
    login,
    getUserFromToken,
    refreshToken,
    logout,
    register,
    requestPasswordReset,
    checkToken,
    resetPassword,
    confirmEmail,
    updatePassword
} from "@/controllers/authController";
import { validateZod } from "@/middlewares/validateZod";
import { isAuthenticated } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    logoutSchema,
} from "@/validators/authValidator";
import { requestResetPasswordSchema, tokenSchema, resetPasswordSchema, updatePasswordSchema } from "@/validators/authValidator";

const router = express.Router();

// **Inscription d'un utilisateur**
router.post(
    "/register",
    validateZod(registerSchema, "body"),
    register

);

// **Connexion d'un utilisateur**
router.post(
    "/login",
    validateZod(loginSchema, "body"),
    login
);

// **Récupérer l'utilisateur depuis le token**
router.get(
    "/me",
    isAuthenticated,
    getUserFromToken
);

// **Rafraîchir le token d'accès**
router.post(
    "/refresh",
    validateZod(refreshTokenSchema, "body"),
    refreshToken
);

// **Déconnexion d'un utilisateur**
router.post(
    "/logout",
    validateZod(logoutSchema, "body"),
    logout
);

// **Réinitialiser le mot de passe**
router.post(
    "/request-password-reset",
    validateZod(requestResetPasswordSchema, "body"),
    requestPasswordReset
);

// **Vérifier si le token de réinitialisation de mot de passe est valide**
router.get(
    "/reset-password/:token",
    validateZod(tokenSchema, "params"),
    checkToken
);

// **Réinitialiser le mot de passe**
router.post(
    "/reset-password",
    validateZod(resetPasswordSchema, "body"),
    resetPassword
);


// **Confirmation d'email**
router.post(
    "/confirm-email",
    validateZod(tokenSchema, "body"),
    confirmEmail
);

// **Update password**
router.post(
    "/update-password",
    validateZod(updatePasswordSchema, "body"),
    updatePassword
);

export default router;