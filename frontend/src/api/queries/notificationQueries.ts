import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationService } from "../notificationService";
import { queryClient } from "@/configs/queryClient";
export const useGetNotifications = (userId: string) => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => notificationService.getNotifications(userId).then(res => res.data),
    });
};

export const useMarkAsRead = () => {
    return useMutation({
        mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
};

export const useMarkAllAsRead = () => {
    return useMutation({
        mutationFn: () => notificationService.markAllAsRead().then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
};

