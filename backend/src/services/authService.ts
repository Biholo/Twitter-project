import jwt from 'jsonwebtoken';
import useragent from 'useragent';
import TokenModel, { IToken, TokenType } from '@/models/tokenModel';
import { IUser } from '@/models/userModel';
import { Request } from 'express';

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('Les secrets JWT doivent être définis');
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = "24h"; // Expiration du token d'accès
const REFRESH_TOKEN_EXPIRATION = "30d"; // Expiration du token de rafraîchissement

/**
 * Génère et enregistre les tokens d'accès et de rafraîchissement pour un utilisateur.
 * @param user L'utilisateur pour lequel générer les tokens.
 * @param req La requête HTTP pour extraire les informations du dispositif.
 * @returns Un objet contenant les tokens générés.
 */
export const generateTokens = async (user: IUser, req: Request): Promise<{ accessToken: IToken; refreshToken: IToken }> => {
  const agent = useragent.parse(req.headers["user-agent"] || '');
  const deviceName = agent.toString(); // Nom du device

  const accessToken: IToken = new TokenModel({
    ownedBy: user._id,
    token: jwt.sign({ id: user._id, roles: user.roles, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION }),
    type: TokenType.ACCESS_TOKEN,
    scopes: user.roles,
    deviceName: deviceName,
    deviceIp: req.ip,
    expiresAt: new Date(Date.now() + 24 * 3600000), // 24 heures
  });

  await accessToken.save();

  const refreshToken: IToken = new TokenModel({
    ownedBy: user._id,
    token: jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION }),
    type: TokenType.REFRESH_TOKEN,
    scopes: user.roles,
    deviceName: deviceName,
    deviceIp: req.ip,
    expiresAt: new Date(Date.now() + 30 * 24 * 3600000), // 30 jours
  });

  await refreshToken.save();

  return { accessToken, refreshToken };
};
