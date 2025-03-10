import { Request, Response } from "express";
import { handleError } from "@/utils/responseFormatter";
import User, { IUser } from "@/models/userModel";

/**
 * Met à jour les informations d'un utilisateur
 * @param req.params.id - L'ID de l'utilisateur à mettre à jour
 * @param req.body.firstName - Le prénom de l'utilisateur (optionnel)
 * @param req.body.lastName - Le nom de l'utilisateur (optionnel)
 * @param req.body.email - L'email de l'utilisateur (optionnel)
 * @param req.body.password - Le mot de passe de l'utilisateur (optionnel)
 * @param req.body.roles - Les rôles de l'utilisateur (optionnel)
 */
export const patchUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Si les permissions sont incluses, les ajouter aux données de mise à jour
    if (updateData.roles) {
      updateData.roles = updateData.roles;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    }).select("-password");
    
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    handleError(res, error, "Erreur lors de la mise à jour de l'utilisateur.");
  }
};


/**
 * Récupère la liste des utilisateurs avec filtrage et pagination
 * @param req.query.role - Filtre par rôle (optionnel)
 * @param req.query.email - Filtre par email (optionnel)
 * @param req.query.firstName - Filtre par prénom (optionnel)
 * @param req.query.lastName - Filtre par nom (optionnel)
 * @param req.query.isActive - Filtre par statut actif (optionnel)
 * @param req.query.createdAt - Filtre par date de création (format: YYYY-MM-DD,YYYY-MM-DD) (optionnel)
 * @param req.query.updatedAt - Filtre par date de mise à jour (format: YYYY-MM-DD,YYYY-MM-DD) (optionnel)
 * @param req.query.sortBy - Champ de tri (default: 'createdAt')
 * @param req.query.order - Ordre de tri ('asc' ou 'desc', default: 'desc')
 * @param req.query.page - Numéro de page (default: 1)
 * @param req.query.limit - Nombre d'éléments par page (default: 10)
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      role,
      email,
      firstName,
      lastName,
      createdAt,
      updatedAt,
      isActive,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Construire l'objet de filtrage
    const filter: any = {};
    
    if (role) filter.role = role;
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (firstName) filter.firstName = { $regex: firstName, $options: 'i' };
    if (lastName) filter.lastName = { $regex: lastName, $options: 'i' };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // Filtres de date
    if (createdAt) {
      const [start, end] = (createdAt as string).split(',');
      filter.createdAt = {
        $gte: new Date(start),
        $lte: end ? new Date(end) : new Date()
      };
    }

    if (updatedAt) {
      const [start, end] = (updatedAt as string).split(',');
      filter.updatedAt = {
        $gte: new Date(start),
        $lte: end ? new Date(end) : new Date()
      };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Construire la requête
    const users = await User.find(filter)
      .select("-password -refreshToken")
      .sort({ [sortBy as string]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    // Obtenir le nombre total pour la pagination
    const total = await User.countDocuments(filter);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    handleError(res, error, "Erreur lors de la récupération des utilisateurs.");
  }
};


/**
 * Récupère un utilisateur par son ID
 * @param req.params.id - L'ID de l'utilisateur à récupérer
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error, "Erreur lors de la récupération de l'utilisateur.");
  }
};


/**
 * Supprime un utilisateur
 * @param req.params.id - L'ID de l'utilisateur à supprimer
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    handleError(res, error, "Erreur lors de la suppression de l'utilisateur.");
  }
};