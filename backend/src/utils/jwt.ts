import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
}

export const verifyToken = (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('Token non fourni'));
    }

    // Enlever le préfixe "Bearer " si présent
    const tokenToVerify = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(tokenToVerify, process.env.JWT_SECRET || '', (err, decoded) => {
      if (err) {
        reject(new Error('Token invalide'));
      }
      resolve(decoded as TokenPayload);
    });
  });
};
