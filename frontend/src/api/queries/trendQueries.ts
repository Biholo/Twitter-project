import { useQuery } from '@tanstack/react-query';
import TrendApi from '@/api/trendApi';

const trendApi = new TrendApi();

export const useGetTrends = () => {
    return useQuery({
        queryKey: ['trends'], 
        queryFn: () => trendApi.getTrends()
    });
}