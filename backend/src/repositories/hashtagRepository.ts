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
                $lookup: {
                    from: 'tweethashtags',
                    localField: '_id',
                    foreignField: 'hashtag_id',
                    as: 'tweets'
                }
            },
            {
                $lookup: {
                    from: 'tweets',
                    localField: 'tweets.tweet_id',
                    foreignField: '_id',
                    as: 'tweetDetails'
                }
            },
            {
                $match: {
                    'tweetDetails.created_at': { $gte: startDate }
                }
            },
            {
                $project: {
                    _id: 1,
                    hashtag: '$label',
                    count: { $size: '$tweetDetails' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);
    }
}

const hashtagRepository = new HashtagRepository();
export default hashtagRepository;
