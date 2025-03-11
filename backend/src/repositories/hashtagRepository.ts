import { BaseRepository } from "./baseRepository";
import Hashtag, { IHashtag } from "@/models/hashtagModel";
import { TrendingOptions } from "@/types";

class HashtagRepository extends BaseRepository<IHashtag> {
    constructor() {
        super(Hashtag);
    }

    async getTrendingHashtags({ limit = 10, timeframe = 'daily' }: TrendingOptions) {
        const startDate = new Date();
        if (timeframe === 'weekly') {
            startDate.setDate(startDate.getDate() - 7);
        } else {
            startDate.setHours(0, 0, 0, 0);
        }

        return this.model.aggregate([
            {
                $match: {
                    created_at: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$hashtag_id',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'hashtag'
                }
            },
            { $unwind: '$hashtag' },
            {
                $project: {
                    _id: 0,
                    hashtag: '$hashtag.label',
                    count: 1
                }
            },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);
    }
}

const hashtagRepository = new HashtagRepository();
export default hashtagRepository;
