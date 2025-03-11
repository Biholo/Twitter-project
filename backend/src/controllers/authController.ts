import { Request, Response } from "express";
import { handleError } from "@/utils/responseFormatter";
import UserModel, { IUser } from "@/models/userModel";
import TokenModel, { IToken, TokenType } from "@/models/tokenModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateTokens } from "@/services/authService";
import ResetPassword from "@/models/resetPasswordModel";
import emailService from "@/services/emailService";
import templateService from "@/services/templateService";
import { AuthenticatedRequest } from "@/types";
import userRepository from "@/repositories/userRepository";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "votre_clé_secrète_très_longue_et_complexe";
const EMAIL_VERIFICATION_TOKEN = process.env.EMAIL_VERIFICATION_TOKEN || "une_autre_clé_secrète_différente_très_longue";

/**
 * Register a new user.
 * @param req.body.username - The user's username.
 * @param req.body.identifier_name - The user's identifier name.
 * @param req.body.email - The user's email address.
 * @param req.body.password - The user's password.
 * @param req.body.roles - Optional roles of the user (defaults to ["client"]).
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, identifier_name, email, password, roles } = req.body;

  if (!username || !identifier_name || !email || !password) {
    res.status(400).json({ message: "Tous les champs sont requis." });
    return;
  }

  // Validation de l'identifier_name
  const identifierNameRegex = /^[a-z0-9_-]+$/;
  if (!identifierNameRegex.test(identifier_name)) {
    res.status(400).json({ 
      message: "L'identifiant ne peut contenir que des lettres minuscules, des chiffres, des tirets (-) et des underscores (_)." 
    });
    return;
  }

  try {
    // Vérifier si l'email, l'identifier_name ou le username est déjà utilisé
    const existingUser = await userRepository.findOne({
      $or: [
        { email },
        { identifier_name }      
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        res.status(409).json({ message: "Cet email est déjà utilisé." });
        return;
      }
      if (existingUser.identifier_name === identifier_name) {
        res.status(409).json({ message: "Cet identifiant est déjà utilisé." });
        return;
      }
      if (existingUser.username === username) {
        res.status(409).json({ message: "Ce nom d'utilisateur est déjà utilisé." });
        return;
      }
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier et définir les rôles
    const userRoles = Array.isArray(roles) ? roles : ["ROLE_USER"];

    // Créer un nouvel utilisateur
    const newUser: IUser = new UserModel({
      username,
      identifier_name,
      email,
      password: hashedPassword,
      roles: userRoles,
    });

    await newUser.save();


  
    const { accessToken, refreshToken } = await generateTokens(newUser, req);

    res.status(200).json({ access_token: accessToken.token, refresh_token: refreshToken.token });

  } catch (error) {
    handleError(res, error, "Erreur lors de l'inscription.");
  }
};


/**
 * Log in a user.
 * @param req.body.email - The user's email address.
 * @param req.body.password - The user's password.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    res.status(400).json({ message: "Email et mot de passe requis." });
    return;
  }

  try {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    user.last_login_at = new Date();
    await user.save();

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Mot de passe incorrect." });
      return;
    }

    // Remplacer la génération manuelle des tokens par generateTokens
    const { accessToken, refreshToken } = await generateTokens(user, req);

    res.status(200).json({ access_token: accessToken.token, refresh_token: refreshToken.token });
  } catch (error) {
    handleError(res, error, "Erreur lors de la connexion.");
  }
};


/**
 * Retrieve a user from an access token.
 * @header Authorization - Bearer token containing the access token.
 */
export const getUserFromToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userReq = req.user;

  try {
    // Convert the user document to a plain JavaScript object
    const user = await UserModel.findById(userReq?.id).select("-password").lean();
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }


    user.last_login_at = new Date();

    res.status(200).json({
      message: "Utilisateur récupéré avec succès.",
      user: user
    });
  } catch (error) {
    console.log(error);
    handleError(res, error, "Erreur lors de la récupération de l'utilisateur.");
  }
};


/**
 * Refresh an access token.
 * @param req.body.token - The refresh token.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ message: "Token de rafraîchissement requis." });
    return;
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
    const user = await userRepository.findById(decoded.id);

    const refreshToken = await TokenModel.findOne({
      ownedBy: user?._id,
      token: token,
      type: TokenType.REFRESH_TOKEN,
    });

    if (!user || !refreshToken) {
      res.status(403).json({ message: "Token expiré." });
      return;
    }

    if (refreshToken.expiresAt < new Date()) {
      res.status(403).json({ message: "Token expiré." });
      return;
    }

    // Générer les nouveaux tokens en utilisant generateTokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user, req);

    res.status(200).json({ access_token: newAccessToken.token, refresh_token: newRefreshToken.token });
  } catch (error) {
    handleError(res, error, "Erreur lors de la rafraîchissement du token.", 403);
  }
};




/**
 * Log out a user by invalidating the refresh token.
 * @param req.body.token - The refresh token to invalidate.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: "Token de rafraîchissement requis pour la déconnexion." });
    return;
  }

  try {
    const user = await UserModel.findOne({ refreshToken: token });
    if (!user) {
      res.status(403).json({ message: "Token invalide." });
      return;
    }

    await TokenModel.deleteOne({ ownedBy: user._id, token: token, type: TokenType.REFRESH_TOKEN });

    await TokenModel.deleteOne({ ownedBy: user._id, token: token, type: TokenType.ACCESS_TOKEN });

    res.status(200).json({ message: "Déconnexion réussie." });
  } catch (error) {
    handleError(res, error, "Erreur lors de la déconnexion.", 500);
  }
};



/**
 * Request a password reset.
 * @param req.body.email - The user's email address.
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email requis." });
    return;
  }

  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    const resetToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: "1h" });

    const resetPassword = new ResetPassword({
      token: resetToken,
      user: user._id,
      expires_at: new Date(Date.now() + 3600000), // 1 heure
    });

    await resetPassword.save();

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = templateService.generateHtml('resetPassword', { name: user.username, link: resetPasswordLink });

    await emailService.sendEmail(user.email, "Réinitialisation de mot de passe", html);

    res.status(200).json({ message: "Réinitialisation de mot de passe demandée avec succès." });
  } catch (error) {
    handleError(res, error, "Erreur lors de la demande de réinitialisation de mot de passe.");
  }
};


/**
 * Reset a user's password.
 * @param req.body.token - The reset token.
 * @param req.body.password - The new password.
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: "Token et mot de passe requis." });
    return;
  }

  try {
    const resetPassword = await ResetPassword.findOne({ token });
    if (!resetPassword) {
      res.status(404).json({ message: "Token invalide." });
      return;
    }

    if (resetPassword.expires_at < new Date()) {
      res.status(403).json({ message: "Token expiré." });
      return;
    }

    const user = await UserModel.findById(resetPassword.user);
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await ResetPassword.deleteOne({ token });

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    handleError(res, error, "Erreur lors de la réinitialisation de mot de passe.");
  }
};

/**
 * Check if token of reset password is valid.
 * @param req.body.token - The token to check.
 */
export const checkToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({ message: "Token de réinitialisation de mot de passe requis." });
    return;
  }

  try {
    const resetPassword = await ResetPassword.findOne({ token });
    if (!resetPassword) {
      res.status(404).json({ message: "Token invalide." });
      return;
    }

    res.status(200).json({ message: "Token valide." });
  } catch (error) {
    handleError(res, error, "Erreur lors de la vérification du token.");
  }
};

/**
 * Confirm a user's email.
 * @param req.body.token - The confirmation token.
 */
export const confirmEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: "Token de confirmation requis." });
    return;
  }

  try {
    const decoded = jwt.verify(token, EMAIL_VERIFICATION_TOKEN) as { id: string };
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    user.is_email_confirmed = true;
    user.confirmed_at = new Date();
    await user.save();

    res.status(200).json({ message: "Email confirmé avec succès." });
  } catch (error) {
    handleError(res, error, "Erreur lors de la confirmation de l'email.");
  }
};


/**
 * Update password
 * @param req.body.old_password - The old password.
 * @param req.body.new_password - The new password.
 */
export const updatePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { old_password, new_password } = req.body;

  if (!old_password || !new_password) {
    res.status(400).json({ message: "Ancien mot de passe et nouveau mot de passe requis." });
    return;
  }

  try {
    const user = await UserModel.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(old_password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Ancien mot de passe incorrect." });
      return;
    }

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    handleError(res, error, "Erreur lors de la mise à jour du mot de passe.");
  }
};
