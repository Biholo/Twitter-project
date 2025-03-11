import { getNotifications, getUnreadNotifications, markAsRead, markAllAsRead } from "@/controllers/notificationController";
import express, { Request, Response } from "express";
import { isAuthenticated } from "@/middlewares/auth";
import { validateZod } from "@/middlewares/validateZod";
import { getNotificationsQuerySchema } from "@/validators/notificationValidator";

export function notificationRoutes() {
    const router = express.Router();
    
    router.get("/", isAuthenticated, validateZod(getNotificationsQuerySchema, "query"), getNotifications);
    router.get("/unread", isAuthenticated, getUnreadNotifications);
    router.post("/:id/read", isAuthenticated, markAsRead);
    router.post("/read-all", isAuthenticated, markAllAsRead);
    return router;
}
