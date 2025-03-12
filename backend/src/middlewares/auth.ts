import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader, verifyToken } from "@/utils/jwt";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        roles: string[];
        email?: string;
        [key: string]: any;
    };
}

// 🔹 Middleware pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);
        const decoded = await verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        res.status(401).json({ message: (error as Error).message });
    }
};

// 🔹 Middleware pour attacher le token (s'il existe) sans bloquer l'accès
export const hasToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.headers.authorization) {
            return next();
        }
        
        const token = extractTokenFromHeader(req.headers.authorization);
        const decoded = await verifyToken(token);
        req.user = decoded;
        console.log("Utilisateur détecté avec token:", req.user);
    } catch (error) {
        console.warn("Token invalide, mais l'accès n'est pas bloqué:", error);
    }

    next();
};
