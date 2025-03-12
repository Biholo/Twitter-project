import { Request, Response } from "express";
import { handleError } from "@/utils/responseFormatter";
import { AuthenticatedRequest } from "@/types";
import notificationRepository from "@/repositories/notificationRepository";
import notificationService from "@/services/notificationService";
import mongoose from "mongoose";

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { read, userId: user_id } = req.query;
    const requestingUserId = req.user?.id;
    const isAdmin = req.user?.role?.includes('ROLE_ADMIN');

    if (!requestingUserId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    // Vérification des permissions
    const userIdToQuery = isAdmin && user_id ? String(user_id) : String(requestingUserId);
    if (!isAdmin && user_id && String(user_id) !== String(requestingUserId)) {
      res.status(403).json({ message: "Accès non autorisé aux notifications d'un autre utilisateur" });
      return;
    }

    const filter: Record<string, any> = { user_id: userIdToQuery };
    if (read !== undefined) {
      filter.is_read = read === 'true';
    }

    const notifications = await notificationRepository.findNotifications(filter);

    res.status(200).json({
        message: "Vous avez bien récupéré vos notifications",
        data: notifications
    });
  } catch (error) {
    handleError(res, error, "Erreur lors de la récupération des notifications");
  }
};

export const updateNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    await notificationRepository.markAsRead(new mongoose.Types.ObjectId(id));
    res.status(200).json({ message: "Notification marquée comme lue" });
  } catch (error) {
    handleError(res, error, "Erreur lors du marquage de la notification comme lue");
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    await notificationRepository.markAllAsRead(new mongoose.Types.ObjectId(userId));
    res.status(200).json({ message: "Toutes les notifications ont été marquées comme lues" });
  } catch (error) {
    handleError(res, error, "Erreur lors du marquage de toutes les notifications comme lues");
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await notificationRepository.delete(id);
    res.status(200).json({ message: "Notification supprimée avec succès." });
  } catch (error) {
    handleError(res, error, "Erreur lors de la suppression de la notification.");
  }
};