import { getNotifications, updateNotification, markAllAsRead } from "@/controllers/notificationController";
import express, { Request, Response } from "express";
import { isAuthenticated } from "@/middlewares/auth";
import { validateZod } from "@/middlewares/validateZod";
import { getNotificationsQuerySchema,updateNotificationSchema } from "@/validators/notificationValidator";

export function notificationRoutes() {
    const router = express.Router();
    
    router.get("/", isAuthenticated, validateZod(getNotificationsQuerySchema, "query"), getNotifications);
    router.patch("/:id", isAuthenticated, validateZod(updateNotificationSchema, "params"), updateNotification);
    router.post("/read-all", isAuthenticated, markAllAsRead);
    return router;
}
