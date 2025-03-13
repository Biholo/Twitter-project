import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  roles: string[];
  email?: string;
  [key: string]: any;
}

export const extractTokenFromHeader = (authHeader?: string): string => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token manquant ou mal formaté');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Token manquant');
  }

  return token;
};

export const verifyToken = async (token: string): Promise<TokenPayload> => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;

    if (!decoded || !decoded.id || !decoded.roles) {
      throw new Error('Token invalide');
    }

    return decoded;
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};
