import { api } from '@/api/interceptor';

class TrendApi {
    private baseUrl = '/api/trending';

    public async getTrends(): Promise<any> {
        const response = await api.fetchRequest(this.baseUrl + "/hashtags", "GET", null, true)
        return response.data;
    }
}

export default TrendApi;