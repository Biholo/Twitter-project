import { useMutation, useQuery } from "@tanstack/react-query";
import userService from "../userService";
import { queryClient } from "@/configs/queryClient";
import { UpdateUser } from "@/types";

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


export const useUpdateUser = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUser }) => 
            userService.updateUser(id, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["autoLogin"] });
        }
    });
}

export const useGetFollowers = (userId: string) => {
    return useQuery({
        queryKey: ["followers", userId],
        queryFn: () => userService.getFollowers(userId).then((res) => res.data),
    });
}

export const useGetFollowings = (userId: string) => {
    return useQuery({
        queryKey: ["followings", userId],
        queryFn: () => userService.getFollowings(userId).then((res) => res.data),
    });
}
