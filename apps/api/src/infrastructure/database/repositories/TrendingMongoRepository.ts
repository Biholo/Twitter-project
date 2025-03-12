import { HashtagCountAggregate } from "@domain/dto/HashtagCountAggregate";
import { TrendingRepository } from "@/domain/gateway/TrendingRepository";
import HashtagModel from "@/infrastructure/database/models/Hashtag";
import { buildTrendingTweetAggregatePipeline } from "@/infrastructure/database/utils/trending";
import TweetModel from "@/infrastructure/database/models/Tweet";
import { UserJwtPayload } from "@/utils/jwt";

export class TrendingMongoRepository implements TrendingRepository {
  async findTrendingHashtags(
    from: Date,
    limit?: number
  ): Promise<HashtagCountAggregate[]> {
    const foundHashtags = await HashtagModel.aggregate<HashtagCountAggregate>([
      { $match: { createdAt: { $gte: from } } },
      {
        $group: {
          _id: "$hashtag_id",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "hashtags",
          localField: "_id",
          foreignField: "_id",
          as: "hashtag",
        },
      },
      { $unwind: "$hashtag" },
      {
        $project: {
          _id: 0,
          hashtag: "$hashtag.label",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      ...(limit ? [{ $limit: limit }] : []),
    ]);

    return foundHashtags;
  }

  async findTrendingTweets(user: UserJwtPayload): Promise<void> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const pipeline = buildTrendingTweetAggregatePipeline(user, {
      startDate,
      endDate,
      limit,
    });

    const [tweets, total] = await Promise.all([
      TweetModel.aggregate(pipeline),
      TweetModel.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }),
    ]);

    return {
      tweets,
      pagination: {
        total,
        page: 1,
        pages: Math.ceil(total / limit),
        has_more: total > limit,
      },
    };
  }
}
