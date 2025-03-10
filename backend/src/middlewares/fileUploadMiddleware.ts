import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Types pour étendre la requête Express
declare module 'express' {
  interface Request {
    fileContent?: string;
    fileBuffer?: Buffer;
    fileType?: string;
  }
}

// Types pour la configuration
interface UploadOptions {
  allowedTypes: string[];
  maxSize?: number;
  fieldName: string;
}

// Type pour les erreurs personnalisées
interface FileUploadError extends Error {
  code?: string;
}

// Configuration par défaut
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Fonction de validation des fichiers
const validateFile = (
  file: Express.Multer.File,
  allowedTypes: string[],
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    const error: FileUploadError = new Error(
      `Format de fichier non supporté. Types acceptés: ${allowedTypes.join(', ')}`
    );
    error.code = 'INVALID_FILE_TYPE';
    cb(error);
  }
};

// Création du middleware
export const createFileUploadMiddleware = (options: UploadOptions) => {
  const {
    allowedTypes,
    maxSize = DEFAULT_MAX_SIZE,
    fieldName
  } = options;

  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    fileFilter: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => validateFile(file, allowedTypes, cb),
    limits: {
      fileSize: maxSize
    }
  }).single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          status: 'error',
          code: err.code,
          message: "Erreur lors du téléchargement du fichier",
          details: err.message
        });
      }

      if (err) {
        return res.status(400).json({
          status: 'error',
          code: err.code || 'UPLOAD_ERROR',
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          code: 'NO_FILE',
          message: "Aucun fichier n'a été téléchargé"
        });
      }

      // Stocker les informations du fichier
      req.fileBuffer = req.file.buffer;
      req.fileType = path.extname(req.file.originalname).toLowerCase();

      // Si c'est un fichier texte, ajouter aussi le contenu en string
      if (['.txt', '.html'].includes(req.fileType)) {
        req.fileContent = req.file.buffer.toString('utf-8');
      }

      next();
    });
  };
};

// Middlewares préconfigurés pour différents cas d'usage
export const textFileUpload = createFileUploadMiddleware({
  allowedTypes: ['.txt', '.html'],
  fieldName: 'page_content'
});

export const imageFileUpload = createFileUploadMiddleware({
  allowedTypes: ['.jpg', '.jpeg', '.png', '.gif'],
  maxSize: 10 * 1024 * 1024, // 10MB
  fieldName: 'image'
});

export const documentFileUpload = createFileUploadMiddleware({
  allowedTypes: ['.pdf', '.doc', '.docx'],
  maxSize: 15 * 1024 * 1024, // 15MB
  fieldName: 'document'
}); 