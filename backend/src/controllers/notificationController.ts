import { Request, Response } from "express";
import { handleError } from "@/utils/responseFormatter";
import { AuthenticatedRequest } from "@/types";
import notificationRepository from "@/repositories/notificationRepository";

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', type, read } = req.query;
    const userId = req.user?.id;

    const filter: any = { receiver: userId };
    if (type) filter.type = type;
    if (read !== undefined) filter.read = read;

    const notifications = await notificationRepository.findWithPagination(
      filter,
      Number(page),
      Number(limit),
      { sort: { created_at: -1 } }
    );

    res.status(200).json(notifications);
  } catch (error) {
    handleError(res, error, "Erreur lors de la récupération des notifications.");
  }
};

export const getUnreadNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié." });
      return;
    }
    const notifications = await notificationRepository.getUnreadNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    handleError(res, error, "Erreur lors de la récupération des notifications non lues.");
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID de notification requis." });
      return;
    }
    await notificationRepository.findByIdAndUpdate(id, { read: true });
    res.status(200).json({ message: "Notification marquée comme lue." });
  } catch (error) {
    handleError(res, error, "Erreur lors du marquage de la notification comme lue.");
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié." });
      return;
    }
    await notificationRepository.markAllAsRead(userId);
    res.status(200).json({ message: "Toutes les notifications ont été marquées comme lues." });
  } catch (error) {
    handleError(res, error, "Erreur lors du marquage de toutes les notifications comme lues.");
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