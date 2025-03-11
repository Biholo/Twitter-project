import mongoose, { SortOrder } from "mongoose";

class FilterService {
    public buildQuery(filters: any) {
        const query: any = {};


        if (filters.search) {
            query.name = { $regex: filters.search, $options: "i" };
        }

        if (filters.country_id) {
            query.country_id = new mongoose.Types.ObjectId(filters.country_id);
        }

        if (filters.is_enabled !== undefined) {
            query.is_enabled = filters.is_enabled === "true";
        }

        return query;
    }

    public applySortingAndPagination(query: any, filters: any) {
        let sort: Record<string, SortOrder> | null = null;

        if (filters.sort) {
            const order = filters.order === "desc" ? -1 : 1;  // Ajoute un ordre de tri par défaut (asc)
            sort = { [filters.sort]: order };
        }

        const page = filters.page ? Number(filters.page) : 1;
        const limit = filters.limit ? Number(filters.limit) : 10;
        const skip = (page - 1) * limit;

        return { sort, skip, limit };
    }
}

const filterService = new FilterService();
export default filterService;
