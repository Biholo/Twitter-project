import { UserJwtPayload } from "@/utils/jwt";
import { PipelineStage } from "mongoose";

export interface TrendingTweetOptions {
  startDate: Date;
  endDate: Date;
  limit: number;
}

export interface Author {
  _id: string;
  username: string;
  identifier_name: string;
  avatar: string;
}

export interface Reply {
  _id: string;
  content: string;
  media_url: string;
  created_at: Date;
  likes_count: number;
  saves_count: number;
  retweets_count: number;
  author: Author;
}

export interface TrendingTweet {
  _id: string;
  content: string;
  media_url: string;
  hashtags: string[];
  created_at: Date;
  engagement_score: number;
  author: Author;
  likes_count: number;
  saves_count: number;
  retweets_count: number;
  is_liked: boolean;
  is_saved: boolean;
  is_retweeted: boolean;
  replies: Reply[];
  replies_count: number;
}

export function buildTrendingTweetAggregatePipeline(
  user: UserJwtPayload,
  opts: TrendingTweetOptions
): PipelineStage[] {
  return [
    {
      $match: {
        created_at: {
          $gte: opts.startDate,
          $lte: opts.endDate,
        },
      },
    },
    {
      $lookup: {
        from: "tweetinteractions",
        localField: "_id",
        foreignField: "tweet_id",
        as: "interactions",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author_id",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $addFields: {
        likes_count: {
          $size: {
            $filter: {
              input: "$interactions",
              as: "interaction",
              cond: { $eq: ["$$interaction.interaction_type", "like"] },
            },
          },
        },
        saves_count: {
          $size: {
            $filter: {
              input: "$interactions",
              as: "interaction",
              cond: { $eq: ["$$interaction.interaction_type", "save"] },
            },
          },
        },
        retweets_count: {
          $size: {
            $filter: {
              input: "$interactions",
              as: "interaction",
              cond: { $eq: ["$$interaction.interaction_type", "retweet"] },
            },
          },
        },
        engagement_score: {
          $add: [
            {
              $size: {
                $filter: {
                  input: "$interactions",
                  as: "interaction",
                  cond: { $eq: ["$$interaction.interaction_type", "like"] },
                },
              },
            },
            {
              $multiply: [
                {
                  $size: {
                    $filter: {
                      input: "$interactions",
                      as: "interaction",
                      cond: {
                        $eq: ["$$interaction.interaction_type", "save"],
                      },
                    },
                  },
                },
                2,
              ],
            },
            {
              $multiply: [
                {
                  $size: {
                    $filter: {
                      input: "$interactions",
                      as: "interaction",
                      cond: {
                        $eq: ["$$interaction.interaction_type", "retweet"],
                      },
                    },
                  },
                },
                3,
              ],
            },
          ],
        },
      },
    },
    /* ------------------------------ user related ------------------------------ */
    {
      $lookup: {
        from: "tweetinteractions",
        let: { tweet_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$tweet_id", "$$tweet_id"] },
                  {
                    $eq: ["$user_id", user.id],
                  },
                ],
              },
            },
          },
        ],
        as: "currentUserInteractions",
      },
    },
    {
      $addFields: {
        is_liked: {
          $in: ["like", "$currentUserInteractions.interaction_type"],
        },
        is_saved: {
          $in: ["save", "$currentUserInteractions.interaction_type"],
        },
        is_retweeted: {
          $in: ["retweet", "$currentUserInteractions.interaction_type"],
        },
      },
    },
    /* --------------------------------- replies -------------------------------- */
    {
      $lookup: {
        from: "tweets",
        let: { tweetId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$parent_tweet_id", "$$tweetId"] },
                  { $eq: ["$tweet_type", "reply"] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "author_id",
              foreignField: "_id",
              as: "author",
            },
          },
          { $unwind: "$author" },
          {
            $lookup: {
              from: "tweetinteractions",
              localField: "_id",
              foreignField: "tweet_id",
              as: "interactions",
            },
          },
          {
            $addFields: {
              likes_count: {
                $size: {
                  $filter: {
                    input: "$interactions",
                    as: "interaction",
                    cond: { $eq: ["$$interaction.interaction_type", "like"] },
                  },
                },
              },
              saves_count: {
                $size: {
                  $filter: {
                    input: "$interactions",
                    as: "interaction",
                    cond: { $eq: ["$$interaction.interaction_type", "save"] },
                  },
                },
              },
              retweets_count: {
                $size: {
                  $filter: {
                    input: "$interactions",
                    as: "interaction",
                    cond: {
                      $eq: ["$$interaction.interaction_type", "retweet"],
                    },
                  },
                },
              },
            },
          },
          { $sort: { created_at: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              content: 1,
              media_url: 1,
              created_at: 1,
              likes_count: 1,
              saves_count: 1,
              retweets_count: 1,
              author: {
                _id: "$author._id",
                username: "$author.username",
                identifier_name: "$author.identifier_name",
                avatar: "$author.avatar",
              },
            },
          },
        ],
        as: "replies",
      },
    },
    /* ------------------------------- tri et sort ------------------------------ */
    { $sort: { engagement_score: -1 } },
    { $limit: opts.limit },
    {
      $project: {
        _id: 1,
        content: 1,
        media_url: 1,
        hashtags: 1,
        created_at: 1,
        engagement_score: 1,
        "author._id": 1,
        "author.username": 1,
        "author.identifier_name": 1,
        "author.avatar": 1,
        likes_count: 1,
        saves_count: 1,
        retweets_count: 1,
        is_liked: 1,
        is_saved: 1,
        is_retweeted: 1,
        replies: 1,
        replies_count: { $size: "$replies" },
      },
    },
  ];
}
