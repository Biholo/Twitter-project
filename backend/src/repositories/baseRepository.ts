import { FilterService } from "@/services/filterService";
import { Model, UpdateQuery } from "mongoose";

export class BaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async find(filters: any = {}) {
        const query = FilterService.buildQuery(filters);
        const { sort, skip, limit } = FilterService.applySortingAndPagination(query, filters);

        return this.model
            .find(query)
            .sort(sort || {})
            .skip(skip)
            .limit(limit);
    }

    async findOne(filters: any = {}) {
        const query = FilterService.buildQuery(filters);
        return this.model.findOne(query);
    }

    async count(filters: any = {}) {
        const query = FilterService.buildQuery(filters);
        return this.model.countDocuments(query);
    }

    async findOneAndUpdate(filter: any, update: UpdateQuery<T>, options: any = {}) {
        return this.model.findOneAndUpdate(filter, update, options);
    }

    async create(data: any) {
        return this.model.create(data);
    }

    async update(filter: any, update: UpdateQuery<T>, options: any = {}) {
        return this.model.updateOne(filter, update, options);
    }

    async delete(filter: any) {
        return this.model.deleteOne(filter);
    }

    async findById(id: string) {
        return this.model.findById(id);
    }

} 