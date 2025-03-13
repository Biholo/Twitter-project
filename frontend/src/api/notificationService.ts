import { api } from "./interceptor";
import { ApiResponse } from "@/types";
import { Notification } from "@/types";

class NotificationService {
    public async getNotifications(user_id: string): Promise<ApiResponse<Notification[]>> {
        const response = await api.fetchRequest(`/api/notifications?user_id=${user_id}`, "GET", {}, true);
        return response;
    }

    public async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
        const response = await api.fetchRequest(`/api/notifications/${notificationId}`, "PATCH", {}, true);
        return response;
    }

    public async markAllAsRead(): Promise<ApiResponse<Notification>> {
        const response = await api.fetchRequest("/api/notifications/read-all", "POST", {}, true);
        return response;
    }
    
}

export const notificationService = new NotificationService();

