import { useMutation } from "@tanstack/react-query";
import userService from "../userService";
import queryClient from "@/configs/queryClient";

export const useFollowUser = () => {
    return useMutation({
        mutationFn: (id: string) => userService.followUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trendingSuggestions"] });
        }
    });
}

export const useUnfollowUser = () => {
    return useMutation({
        mutationFn: (id: string) => userService.unfollowUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trendingSuggestions"] });
        }
    });
}


