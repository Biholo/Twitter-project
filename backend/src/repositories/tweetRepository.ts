import { Types, PipelineStage } from 'mongoose';
import { TweetFilters, TweetFilterOptions, TweetDetailsOptions } from '@/types';
import { BaseRepository } from './baseRepository';
import Tweet, { ITweet } from '@/models/tweetModel';
import { TrendingOptions } from '@/types';
class TweetRepository extends BaseRepository<ITweet> {
  constructor() {
    super(Tweet);
  }

  async getTweetDetails({ tweetId, authenticatedUserId }: TweetDetailsOptions) {
    const pipeline = [
      { 
        $match: { 
          _id: new Types.ObjectId(tweetId)
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'tweetinteractions',
          localField: '_id',
          foreignField: 'tweet_id',
          as: 'interactions'
        }
      }
    ] as PipelineStage[];

    // Si un utilisateur authentifié est spécifié, on ajoute ses interactions
    if (authenticatedUserId) {
      pipeline.push({
        $lookup: {
          from: 'tweetinteractions',
          let: { tweet_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$tweet_id', '$$tweet_id'] },
                    { $eq: ['$user_id', new Types.ObjectId(authenticatedUserId)] }
                  ]
                }
              }
            }
          ],
          as: 'currentUserInteractions'
        }
      });
    }

    // Ajout des champs calculés
    pipeline.push({
      $addFields: {
        likes_count: {
          $size: {
            $filter: {
              input: '$interactions',
              as: 'interaction',
              cond: { $eq: ['$$interaction.interaction_type', 'like'] }
            }
          }
        },
        saves_count: {
          $size: {
            $filter: {
              input: '$interactions',
              as: 'interaction',
              cond: { $eq: ['$$interaction.interaction_type', 'save'] }
            }
          }
        },
        is_liked: {
          $cond: {
            if: authenticatedUserId,
            then: {
              $in: ['like', '$currentUserInteractions.interaction_type']
            },
            else: false
          }
        },
        is_saved: {
          $cond: {
            if: authenticatedUserId,
            then: {
              $in: ['save', '$currentUserInteractions.interaction_type']
            },
            else: false
          }
        }
      }
    });

    // Récupération de tous les commentaires avec leurs détails
    pipeline.push({
      $lookup: {
        from: 'tweets',
        let: { tweetId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { 
                $and: [
                  { $eq: ['$parent_tweet_id', '$$tweetId'] },
                  { $eq: ['$tweet_type', 'reply'] }
                ]
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'author_id',
              foreignField: '_id',
              as: 'author'
            }
          },
          { $unwind: '$author' },
          {
            $lookup: {
              from: 'tweetinteractions',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'interactions'
            }
          },
          {
            $addFields: {
              likes_count: {
                $size: {
                  $filter: {
                    input: '$interactions',
                    as: 'interaction',
                    cond: { $eq: ['$$interaction.interaction_type', 'like'] }
                  }
                }
              },
              saves_count: {
                $size: {
                  $filter: {
                    input: '$interactions',
                    as: 'interaction',
                    cond: { $eq: ['$$interaction.interaction_type', 'save'] }
                  }
                }
              }
            }
          },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1,
              content: 1,
              media_url: 1,
              created_at: 1,
              likes_count: 1,
              saves_count: 1,
              'author._id': 1,
              'author.username': 1,
              'author.identifier_name': 1,
              'author.avatar': 1
            }
          }
        ],
        as: 'replies'
      }
    });

    // Projection finale
    pipeline.push({
      $project: {
        _id: 1,
        content: 1,
        media_url: 1,
        hashtags: 1,
        created_at: 1,
        retweets_count: 1,
        tweet_type: 1,
        'author._id': 1,
        'author.username': 1,
        'author.identifier_name': 1,
        'author.avatar': 1,
        likes_count: 1,
        saves_count: 1,
        is_liked: 1,
        is_saved: 1,
        parent_tweet_id: 1,
        replies: 1,
        replies_count: { $size: '$replies' }
      }
    });

    const [tweet] = await this.model.aggregate(pipeline);
    return tweet;
  }

  async findTweetsWithFilters({ filters, authenticatedUserId }: TweetFilterOptions) {
    const {
      user_id,
      hashtag,
      search,
      start_date,
      end_date,
      parent_tweet_id,
      tweet_type,
      include_liked,
      include_saved,
      page = 1,
      limit = 10
    } = filters;

    let pipeline = [] as PipelineStage[];

    // Si on cherche les tweets likés ou sauvegardés
    if ((include_liked || include_saved) && user_id) {
      pipeline.push(
        {
          $lookup: {
            from: 'tweetinteractions',
            let: { tweet_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$tweet_id', '$$tweet_id'] },
                      { $eq: ['$user_id', new Types.ObjectId(user_id)] },
                      {
                        $cond: {
                          if: { $and: [{ $eq: [true, include_liked] }, { $eq: [true, include_saved] }] },
                          then: { $in: ['$interaction_type', ['like', 'save']] },
                          else: {
                            $cond: {
                              if: { $eq: [true, include_liked] },
                              then: { $eq: ['$interaction_type', 'like'] },
                              else: { $eq: ['$interaction_type', 'save'] }
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ],
            as: 'userInteractions'
          }
        },
        {
          $match: {
            'userInteractions.0': { $exists: true }
          }
        }
      );
    }

    const query: any = {};

    // Filtre par utilisateur
    if (user_id) {
      query.author_id = new Types.ObjectId(user_id);
    }

    // Filtre par hashtag
    if (hashtag) {
      query.hashtags = hashtag;
    }

    // Filtre par texte de recherche
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { hashtags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtre par date
    if (start_date || end_date) {
      query.created_at = {};
      if (start_date) query.created_at.$gte = start_date;
      if (end_date) query.created_at.$lte = end_date;
    }

    // Filtre par tweet parent
    if (parent_tweet_id) {
      query.parent_tweet_id = parent_tweet_id;
    }

    // Filtre par type de tweet
    if (tweet_type) {
      query.tweet_type = tweet_type;
    }

    const skip = (page - 1) * limit;

    // Ajout du match initial au pipeline
    pipeline.push({ $match: query });

    // Ajout des lookups standards
    pipeline.push(
      {
        $lookup: {
          from: 'users',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'tweetinteractions',
          localField: '_id',
          foreignField: 'tweet_id',
          as: 'interactions'
        }
      }
    );

    // Si un utilisateur authentifié est spécifié, on ajoute ses interactions
    if (authenticatedUserId) {
      pipeline.push({
        $lookup: {
          from: 'tweetinteractions',
          let: { tweet_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$tweet_id', '$$tweet_id'] },
                    { $eq: ['$user_id', new Types.ObjectId(authenticatedUserId)] }
                  ]
                }
              }
            }
          ],
          as: 'currentUserInteractions'
        }
      });
    }

    // Ajout des champs calculés
    pipeline.push({
      $addFields: {
        likes_count: {
          $size: {
            $filter: {
              input: '$interactions',
              as: 'interaction',
              cond: { $eq: ['$$interaction.interaction_type', 'like'] }
            }
          }
        },
        saves_count: {
          $size: {
            $filter: {
              input: '$interactions',
              as: 'interaction',
              cond: { $eq: ['$$interaction.interaction_type', 'save'] }
            }
          }
        },
        is_liked: {
          $cond: {
            if: authenticatedUserId,
            then: {
              $in: ['like', '$currentUserInteractions.interaction_type']
            },
            else: false
          }
        },
        is_saved: {
          $cond: {
            if: authenticatedUserId,
            then: {
              $in: ['save', '$currentUserInteractions.interaction_type']
            },
            else: false
          }
        }
      }
    });

    // Ajout du tri, skip et limit
    pipeline.push(
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Projection finale
    pipeline.push({
      $project: {
        _id: 1,
        content: 1,
        media_url: 1,
        hashtags: 1,
        created_at: 1,
        retweets_count: 1,
        tweet_type: 1,
        'author._id': 1,
        'author.username': 1,
        'author.identifier_name': 1,
        'author.avatar': 1,
        likes_count: 1,
        saves_count: 1,
        is_liked: 1,
        is_saved: 1,
        parent_tweet_id: 1
      }
    });

    // Ajout des réponses récentes
    pipeline.push({
      $lookup: {
        from: 'tweets',
        let: { tweetId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { 
                $and: [
                  { $eq: ['$parent_tweet_id', '$$tweetId'] },
                  { $eq: ['$tweet_type', 'reply'] }
                ]
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'author_id',
              foreignField: '_id',
              as: 'author'
            }
          },
          { $unwind: '$author' },
          { $sort: { created_at: -1 } },
          { $limit: 3 },
          {
            $project: {
              _id: 1,
              content: 1,
              created_at: 1,
              'author._id': 1,
              'author.username': 1,
              'author.identifier_name': 1,
              'author.avatar': 1
            }
          }
        ],
        as: 'replies'
      }
    });

    // Exécution du pipeline
    const [tweets, total] = await Promise.all([
      this.model.aggregate(pipeline),
      (include_liked || include_saved) && user_id
        ? this.model.aggregate([...pipeline.slice(0, 2), { $count: 'total' }]).then(result => result[0]?.total || 0)
        : this.model.countDocuments(query)
    ]);

    return {
      tweets,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        has_more: total > skip + limit
      }
    };
  }

  async getTrendingTweets({ limit = 10, date }: TrendingOptions) {
    const startDate = date || new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    return this.model.aggregate([
        {
            $match: {
                created_at: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $lookup: {
                from: 'tweetinteractions',
                localField: '_id',
                foreignField: 'tweet_id',
                as: 'interactions'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'author_id',
                foreignField: '_id',
                as: 'author'
            }
        },
        { $unwind: '$author' },
        {
            $addFields: {
                engagement_score: {
                    $add: [
                        {
                            $size: {
                                $filter: {
                                    input: '$interactions',
                                    as: 'interaction',
                                    cond: { $eq: ['$$interaction.interaction_type', 'like'] }
                                }
                            }
                        },
                        {
                            $multiply: [
                                {
                                    $size: {
                                        $filter: {
                                            input: '$interactions',
                                            as: 'interaction',
                                            cond: { $eq: ['$$interaction.interaction_type', 'retweet'] }
                                        }
                                    }
                                },
                                2
                            ]
                        }
                    ]
                }
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                created_at: 1,
                media_url: 1,
                'author._id': 1,
                'author.username': 1,
                'author.identifier_name': 1,
                'author.avatar': 1,
                engagement_score: 1
            }
        },
        { $sort: { engagement_score: -1 } },
        { $limit: limit }
    ]);
}

async findTrendingTweets({ limit = 10, date, authenticatedUserId }: { limit: number, date: Date, authenticatedUserId?: string }) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          created_at: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $lookup: {
          from: 'tweetinteractions',
          localField: '_id',
          foreignField: 'tweet_id',
          as: 'interactions'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $addFields: {
          likes_count: {
            $size: {
              $filter: {
                input: '$interactions',
                as: 'interaction',
                cond: { $eq: ['$$interaction.interaction_type', 'like'] }
              }
            }
          },
          saves_count: {
            $size: {
              $filter: {
                input: '$interactions',
                as: 'interaction',
                cond: { $eq: ['$$interaction.interaction_type', 'save'] }
              }
            }
          },
          retweets_count: {
            $size: {
              $filter: {
                input: '$interactions',
                as: 'interaction',
                cond: { $eq: ['$$interaction.interaction_type', 'retweet'] }
              }
            }
          },
          engagement_score: {
            $add: [
              {
                $size: {
                  $filter: {
                    input: '$interactions',
                    as: 'interaction',
                    cond: { $eq: ['$$interaction.interaction_type', 'like'] }
                  }
                }
              },
              {
                $multiply: [
                  {
                    $size: {
                      $filter: {
                        input: '$interactions',
                        as: 'interaction',
                        cond: { $eq: ['$$interaction.interaction_type', 'save'] }
                      }
                    }
                  },
                  2
                ]
              },
              {
                $multiply: [
                  {
                    $size: {
                      $filter: {
                        input: '$interactions',
                        as: 'interaction',
                        cond: { $eq: ['$$interaction.interaction_type', 'retweet'] }
                      }
                    }
                  },
                  3
                ]
              }
            ]
          }
        }
      }
    ];

    // Ajout des interactions de l'utilisateur authentifié si présent
    if (authenticatedUserId) {
      pipeline.push({
        $lookup: {
          from: 'tweetinteractions',
          let: { tweet_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$tweet_id', '$$tweet_id'] },
                    { $eq: ['$user_id', new Types.ObjectId(authenticatedUserId)] }
                  ]
                }
              }
            }
          ],
          as: 'currentUserInteractions'
        }
      },
      {
        $addFields: {
          is_liked: {
            $in: ['like', '$currentUserInteractions.interaction_type']
          },
          is_saved: {
            $in: ['save', '$currentUserInteractions.interaction_type']
          },
          is_retweeted: {
            $in: ['retweet', '$currentUserInteractions.interaction_type']
          }
        }
      });
    }

    // Ajout des réponses récentes
    pipeline.push({
      $lookup: {
        from: 'tweets',
        let: { tweetId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { 
                $and: [
                  { $eq: ['$parent_tweet_id', '$$tweetId'] },
                  { $eq: ['$tweet_type', 'reply'] }
                ]
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'author_id',
              foreignField: '_id',
              as: 'author'
            }
          },
          { $unwind: '$author' },
          {
            $lookup: {
              from: 'tweetinteractions',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'interactions'
            }
          },
          {
            $addFields: {
              likes_count: {
                $size: {
                  $filter: {
                    input: '$interactions',
                    as: 'interaction',
                    cond: { $eq: ['$$interaction.interaction_type', 'like'] }
                  }
                }
              },
              saves_count: {
                $size: {
                  $filter: {
                    input: '$interactions',
                    as: 'interaction',
                    cond: { $eq: ['$$interaction.interaction_type', 'save'] }
                  }
                }
              },
              retweets_count: {
                $size: {
                  $filter: {
                    input: '$interactions',
                    as: 'interaction',
                    cond: { $eq: ['$$interaction.interaction_type', 'retweet'] }
                  }
                }
              }
            }
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
                _id: '$author._id',
                username: '$author.username',
                identifier_name: '$author.identifier_name',
                avatar: '$author.avatar'
              }
            }
          }
        ],
        as: 'replies'
      }
    });

    // Tri et projection finale
    pipeline.push(
      { $sort: { engagement_score: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          content: 1,
          media_url: 1,
          hashtags: 1,
          created_at: 1,
          engagement_score: 1,
          'author._id': 1,
          'author.username': 1,
          'author.identifier_name': 1,
          'author.avatar': 1,
          likes_count: 1,
          saves_count: 1,
          retweets_count: 1,
          is_liked: 1,
          is_saved: 1,
          is_retweeted: 1,
          replies: 1,
          replies_count: { $size: '$replies' }
        }
      }
    );

    const [tweets, total] = await Promise.all([
      this.model.aggregate(pipeline),
      this.model.countDocuments({
        created_at: {
          $gte: startDate,
          $lte: endDate
        }
      })
    ]);

    return {
      tweets,
      pagination: {
        total,
        page: 1,
        pages: Math.ceil(total / limit),
        has_more: total > limit
      }
    };
  }
}

const tweetRepository = new TweetRepository();
export default tweetRepository;

