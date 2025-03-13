import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (mis à jour pour les vidéos)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Seules les images et les vidéos sont acceptées.'));
    }
  },
});

// Configuration pour différents scénarios d'upload
export const uploadFields = {
  tweet: upload.array('files', 4), // Permet jusqu'à 4 fichiers avec le nom 'files'
  profile: upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ])
};