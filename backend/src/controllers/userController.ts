import { Request, Response } from "express";
import { handleError } from "@/utils/responseFormatter";
import User, { IUser } from "@/models/userModel";
import userRepository from "@/repositories/userRepository";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "@/types";
import followRepository from "@/repositories/followRepository";

/**
 * Met à jour les informations d'un utilisateur
 * @param req.params.id - L'ID de l'utilisateur à mettre à jour
 * @param req.body.firstName - Le prénom de l'utilisateur (optionnel)
 * @param req.body.lastName - Le nom de l'utilisateur (optionnel)
 * @param req.body.email - L'email de l'utilisateur (optionnel)
 * @param req.body.password - Le mot de passe de l'utilisateur (optionnel)
 * @param req.body.roles - Les rôles de l'utilisateur (optionnel)
 */
export const patchUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const authenticatedUser = req.user;

    const isAdmin = authenticatedUser?.role?.includes('ROLE_ADMIN');
    const isOwnProfile = authenticatedUser?.id.toString() === id;
    
    if (updateData.roles && !isAdmin) {
      delete updateData.roles;
    }
    
    if(!isOwnProfile && !isAdmin) {
      res.status(403).json({ message: "Vous n'avez pas les permissions pour modifier ce profil." });
      return;
    }

    const updatedUser = await userRepository.update(
      { _id: new mongoose.Types.ObjectId(id) },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }

    const user = await userRepository.findOne({ _id: new mongoose.Types.ObjectId(id) });

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès.",
      data: user
    });
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
        $gte: start ? new Date(start) : new Date(),
        $lte: end ? new Date(end) : new Date()
      };
    }

    if (updatedAt) {
      const [start, end] = (updatedAt as string).split(',');
      filter.updatedAt = {
        $gte: start ? new Date(start) : new Date(),
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
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ message: "L'ID de l'utilisateur est requis." });
      return;
    }

    const user = await userRepository.getProfileByUserId(new mongoose.Types.ObjectId(userId));

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }

    res.status(200).json({
      message: "Utilisateur récupéré avec succès.",
      data: user
    });
  } catch (error) {
    handleError(res, error, "Erreur lors de la récupération de l'utilisateur.");
  }
};

/**
 * Follow a user
 * @param req.params.id - L'ID de l'utilisateur à suivre
 */
export const followUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const followerId = req.user?.id;

    if (!userId || !followerId) {
      res.status(400).json({ message: "L'ID de l'utilisateur et le followerId sont requis." });
      return;
    }

    const existingFollow = await followRepository.findOne({ follower_id: followerId, following_id: userId });
    if (existingFollow) {
      res.status(400).json({ message: "Vous suivez déjà cet utilisateur." });
      return;
    }
    
    const newFollow =  followRepository.create({ follower_id: followerId, following_id: userId });
    
    res.status(201).json({
      message: "Utilisateur suivi avec succès.",
      data: newFollow
    });
    
  } catch (error) {
    handleError(res, error, "Erreur lors de la suivi de l'utilisateur.");
  }
};

/**
 * Unfollow a user
 * @param req.params.id - L'ID de l'utilisateur à suivre
 */
export const unfollowUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const followerId = req.user?.id;

    if (!userId || !followerId) {
      res.status(400).json({ message: "L'ID de l'utilisateur et le followerId sont requis." });
      return;
    }

    const existingFollow = await followRepository.findOne({ follower_id: followerId, following_id: userId });
    if (!existingFollow) {
      res.status(400).json({ message: "Vous ne suivez pas cet utilisateur." });
      return;
    }

    await followRepository.delete({ _id: existingFollow._id });
    
    res.status(200).json({
      message: "Utilisateur désabonné avec succès.",
      data: existingFollow
    });
    return;
    
  } catch (error) {
    handleError(res, error, "Erreur lors de la désabonnement de l'utilisateur.");
    return;
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

/**
 * Récupère les followers d'un utilisateur
 * @param req.params.userId - L'ID de l'utilisateur
 * @param req.query.page - La page à récupérer (optionnel, défaut: 1)
 * @param req.query.limit - Le nombre d'éléments par page (optionnel, défaut: 10)
 */
export const getFollowers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user?.id;

    if(!userId) {
      res.status(400).json({ message: "L'ID de l'utilisateur est requis." });
      return;
    }

    const result = await followRepository.getFollowers(
      userId, 
      Number(page), 
      Number(limit),
      currentUserId?.toString()
    );

    res.status(200).json({
      message: "Followers récupérés avec succès",
      data: result.followers,
      pagination: result.pagination
    });
    return;
  } catch (error) {
    handleError(res, error, "Erreur lors de la récupération des followers");
    return;
  }
};

/**
 * Récupère les followings d'un utilisateur
 * @param req.params.userId - L'ID de l'utilisateur
 * @param req.query.page - La page à récupérer (optionnel, défaut: 1)
 * @param req.query.limit - Le nombre d'éléments par page (optionnel, défaut: 10)
 */
export const getFollowings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user?.id;

    if(!userId) {
      res.status(400).json({ message: "L'ID de l'utilisateur est requis." });
      return;
    }

    const result = await followRepository.getFollowings(
      userId, 
      Number(page), 
      Number(limit),
      currentUserId?.toString()
    );

    res.status(200).json({
      message: "Followings récupérés avec succès",
      data: result.followings,
      pagination: result.pagination
    });
    return;
  } catch (error) {
    handleError(res, error, "Erreur lors de la récupération des followings");
    return;
  }
};



