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
}

export default new UserService();