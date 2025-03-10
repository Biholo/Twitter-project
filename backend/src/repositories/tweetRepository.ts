import { BaseRepository } from "./baseRepository";
import Tweet, { ITweet } from "@/models/tweetModel";
import mongoose from "mongoose";
import { TweetFilters } from "@/types";

class TweetRepository extends BaseRepository<ITweet> {
  constructor() {
    super(Tweet);
  }

  async findTweetsWithFilters(filters: TweetFilters) {
    const {
      user_id,
      hashtag,
      search,
      start_date,
      end_date,
      parent_tweet_id,
      page = 1,
      limit = 10
    } = filters;

    const query: any = {};

    // Filtre par utilisateur
    if (user_id) {
      query.author = new mongoose.Types.ObjectId(user_id);
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

    const skip = (page - 1) * limit;

    // Exécution de la requête avec agrégation pour inclure les informations connexes
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
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
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          content: 1,
          media_url: 1,
          hashtags: 1,
          created_at: 1,
          'author._id': 1,
          'author.username': 1,
          'author.avatar': 1,
          likes_count: 1,
          saves_count: 1,
          parent_tweet_id: 1
        }
      }
    ];

    const [tweets, total] = await Promise.all([
      this.model.aggregate(pipeline as any),
      this.model.countDocuments(query)
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

  async getTweetDetails(tweetId: string, userId: mongoose.Types.ObjectId) {
    const pipeline = [
      { 
        $match: { 
          _id: new mongoose.Types.ObjectId(tweetId) 
        } 
      },

      // Vérifier si l'utilisateur courant a liké/sauvegardé le tweet principal
      {
        $lookup: {
          from: 'tweetinteractions',
          let: { tweetId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$tweet_id', '$$tweetId'] },
                    { $eq: ['$user_id', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: 'userInteractions'
        }
      },

      // Ajouter les champs is_liked et is_saved pour le tweet principal
      {
        $addFields: {
          is_liked: {
            $in: ['like', '$userInteractions.interaction_type']
          },
          is_saved: {
            $in: ['save', '$userInteractions.interaction_type']
          }
        }
      },

      // Récupérer les réponses avec leurs interactions
      {
        $lookup: {
          from: 'tweets',
          let: { tweetId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$parent_tweet_id', '$$tweetId'] }
              }
            },
            // Joindre les auteurs des réponses
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
              }
            },
            { $unwind: '$author' },
            // Vérifier les interactions de l'utilisateur sur les réponses
            {
              $lookup: {
                from: 'tweetinteractions',
                let: { replyId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$tweet_id', '$$replyId'] },
                          { $eq: ['$user_id', new mongoose.Types.ObjectId(userId)] }
                        ]
                      }
                    }
                  }
                ],
                as: 'userInteractions'
              }
            },
            // Compter toutes les interactions
            {
              $lookup: {
                from: 'tweetinteractions',
                localField: '_id',
                foreignField: 'tweet_id',
                as: 'allInteractions'
              }
            },
            // Calculer tous les compteurs et statuts
            {
              $addFields: {
                likes_count: {
                  $size: {
                    $filter: {
                      input: '$allInteractions',
                      as: 'interaction',
                      cond: { $eq: ['$$interaction.interaction_type', 'like'] }
                    }
                  }
                },
                saves_count: {
                  $size: {
                    $filter: {
                      input: '$allInteractions',
                      as: 'interaction',
                      cond: { $eq: ['$$interaction.interaction_type', 'save'] }
                    }
                  }
                },
                is_liked: {
                  $in: ['like', '$userInteractions.interaction_type']
                },
                is_saved: {
                  $in: ['save', '$userInteractions.interaction_type']
                }
              }
            },
            { $sort: { created_at: -1 } }
          ],
          as: 'replies'
        }
      },

      // Projet final mis à jour
      {
        $project: {
          _id: 1,
          content: 1,
          media_url: 1,
          hashtags: 1,
          created_at: 1,
          'author._id': 1,
          'author.username': 1,
          'author.avatar': 1,
          likes_count: 1,
          saves_count: 1,
          is_liked: 1,
          is_saved: 1,
          parent_tweet_id: 1,
          replies: {
            $map: {
              input: '$replies',
              as: 'reply',
              in: {
                _id: '$$reply._id',
                content: '$$reply.content',
                created_at: '$$reply.created_at',
                media_url: '$$reply.media_url',
                likes_count: '$$reply.likes_count',
                saves_count: '$$reply.saves_count',
                is_liked: '$$reply.is_liked',
                is_saved: '$$reply.is_saved',
                author: {
                  _id: '$$reply.author._id',
                  username: '$$reply.author.username',
                  avatar: '$$reply.author.avatar'
                }
              }
            }
          },
          replies_count: { $size: '$replies' }
        }
      }
    ];

    const [tweet] = await this.model.aggregate(pipeline as any);
    return tweet;
  }
}

const tweetRepository = new TweetRepository();
export default tweetRepository;