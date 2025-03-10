import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // Utilisation correcte d'import ES6

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        roles: string[];
        email?: string;
        [key: string]: any;
    };
}

// 🔹 Middleware pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token manquant ou mal formaté." });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token manquant." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as AuthenticatedRequest["user"];

        if (!decoded || !decoded.id || !decoded.roles) {
            res.status(401).json({ message: "Token invalide." });
            return;
        }

        req.user = decoded; // ✅ Affectation correcte

        next();
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        res.status(401).json({ message: "Token invalide ou expiré." });
        return;
    }
};


// 🔹 Middleware pour attacher le token (s'il existe) sans bloquer l'accès
export const hasToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(); // ✅ Laisser passer même sans token
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return next(); // ✅ Laisser passer même sans token
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as AuthenticatedRequest["user"];
        req.user = decoded; // ✅ Attacher les infos du user

        console.log("Utilisateur détecté avec token:", req.user);
    } catch (error) {
        console.warn("Token invalide, mais l'accès n'est pas bloqué:", error);
    }

    next();
};
