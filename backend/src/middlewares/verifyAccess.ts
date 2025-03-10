import { Request, Response, NextFunction, RequestHandler } from "express";
import { Role, hasInheritedRole } from "@/config/role";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: Role;
    [key: string]: any;
  };
}

/**
 * Middleware pour vérifier que l'utilisateur dispose des droits d'accès en tenant compte de la hiérarchie des rôles.
 * @param requiredRole - Rôle requis pour accéder à la ressource.
 */
export const verifyAccess = (requiredRole: Role): RequestHandler => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized: Utilisateur non authentifié." });
      return;
    }

    if (!hasInheritedRole(user.role, requiredRole)) {
      res.status(403).json({ message: "Forbidden: Vous n'avez pas les permissions requises." });
      return;
    }

    next();
  };
};