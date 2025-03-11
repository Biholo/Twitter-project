import { Request, Response } from "express";
import Follow from "@/models/followModel"; // Le modèle Follow

// Suivre un utilisateur
export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.user?.id;
    const followingId = req.params.id;

    if (followerId === followingId) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous suivre vous-même" });
    }

    const existingFollow = await Follow.findOne({ followerId, followingId });
    if (existingFollow) {
      return res.status(400).json({ message: "Vous suivez déjà cet utilisateur" });
    }

    const follow = new Follow({ followerId, followingId, followDate: new Date() });
    await follow.save();

    return res.status(201).json({ message: "Utilisateur suivi avec succès" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors du suivi de l'utilisateur", error });
  }
};

// Se désabonner d'un utilisateur
export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.user?.id;
    const followingId = req.params.id;

    const follow = await Follow.findOneAndDelete({ followerId, followingId });
    if (!follow) {
      return res.status(404).json({ message: "Relation de suivi non trouvée" });
    }

    return res.status(200).json({ message: "Utilisateur désabonné avec succès" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'annulation du suivi", error });
  }
};

// Récupérer les abonnés
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const followers = await Follow.find({ followingId: userId }).populate("followerId");
    return res.status(200).json({ followers });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des abonnés", error });
  }
};

// Récupérer les abonnements
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const following = await Follow.find({ followerId: userId }).populate("followingId");
    return res.status(200).json({ following });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des abonnements", error });
  }
};
