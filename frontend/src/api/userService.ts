import { UpdateUser, UserList, User } from "@/types";
import { api } from "./interceptor";
import { ApiResponse } from "@/types";
class UserService {

    public async followUser(id: string) : Promise<ApiResponse<void>> {
        const response = await api.fetchRequest(`/api/users/${id}/follow`, "POST", {}, true);
        return response;
    }

    public async unfollowUser(id: string) : Promise<ApiResponse<void>> {
        const response = await api.fetchRequest(`/api/users/${id}/unfollow`, "POST", {}, true);
        return response;        
    }

    public async updateUser(id: string, data: UpdateUser) : Promise<ApiResponse<void>> {
        const response = await api.fetchRequest(`/api/users/${id}`, "PATCH", data, true);
        return response;
    }

    public async getFollowers(userId: string) : Promise<ApiResponse<UserList[]>> {
        const response = await api.fetchRequest(`/api/users/${userId}/followers`, "GET", {}, true);
        return response;
    }

    public async getFollowings(userId: string) : Promise<ApiResponse<UserList[]>> {
        const response = await api.fetchRequest(`/api/users/${userId}/followings`, "GET", {}, true);
        return response;
    }

    public async getUserById(userId: string) : Promise<ApiResponse<User>> {
        const response = await api.fetchRequest(`/api/users/${userId}`, "GET", {}, true);
        return response;
    }
}

export default new UserService();