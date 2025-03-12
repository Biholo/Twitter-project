import { IUser } from "@/models/userModel";
import { Request } from "express";
import { BaseRepository } from "./baseRepository";
import User from "@/models/userModel";
import mongoose from "mongoose";
import Follow from "@/models/followModel";

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmailOrIdentifierName(email: string, identifier_name: string): Promise<IUser | null> {
    return this.model.findOne({ $or: [{ email }, { identifier_name }] });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }

  async getProfileByUserId(userId: mongoose.Types.ObjectId) {
    const [result] = await this.model.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: 'follows',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$following', '$$userId'] }
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'follower',
                foreignField: '_id',
                as: 'followerInfo'
              }
            },
            { $unwind: '$followerInfo' },
            {
              $project: {
                _id: '$followerInfo._id',
                username: '$followerInfo.username',
                identifier_name: '$followerInfo.identifier_name',
                avatar: '$followerInfo.avatar'
              }
            }
          ],
          as: 'followers'
        }
      },
      {
        $lookup: {
          from: 'follows',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$follower', '$$userId'] }
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'following',
                foreignField: '_id',
                as: 'followingInfo'
              }
            },
            { $unwind: '$followingInfo' },
            {
              $project: {
                _id: '$followingInfo._id',
                username: '$followingInfo.username',
                identifier_name: '$followingInfo.identifier_name',
                avatar: '$followingInfo.avatar'
              }
            }
          ],
          as: 'following'
        }
      },
      {
        $project: {
          password: 0,
          refreshToken: 0,
          followers_count: { $size: '$followers' },
          following_count: { $size: '$following' }
        }
      }
    ]);

    return result;
  }

  async getFollowSuggestions({ userId, minSuggestions }: { userId: string, minSuggestions: number }): Promise<IUser[]> {
    // Convertir l'ID en ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Récupérer d'abord les IDs des utilisateurs que la personne suit déjà
    const following = await Follow.find({ follower: userObjectId }).select('following_id');
    const followingIds = following.map(f => f.following_id);

    // Récupérer les suggestions basées sur les abonnements actuels
    const suggestionsFromFollowing = await this.model.aggregate([
      // Exclure l'utilisateur lui-même et les personnes qu'il suit déjà
      {
        $match: {
          _id: { 
            $ne: userObjectId,
            $nin: followingIds
          }
        }
      },
      // Vérifier si les personnes que je suis suivent ces utilisateurs
      {
        $lookup: {
          from: 'follows',
          let: { suggestedUserId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$follower', followingIds] },
                    { $eq: ['$following_id', '$$suggestedUserId'] }
                  ]
                }
              }
            }
          ],
          as: 'mutualFollows'
        }
      },
      // Trier par nombre de follows mutuels
      {
        $addFields: {
          mutualFollowsCount: { $size: '$mutualFollows' }
        }
      },
      {
        $sort: { mutualFollowsCount: -1 }
      },
      // Projeter uniquement les champs nécessaires
      {
        $project: {
          _id: 1,
          username: 1,
          identifier_name: 1,
          bio: 1,
          avatar: 1
        }
      },
      // Limiter le nombre de suggestions
      { $limit: minSuggestions }
    ]);

    // Si nous n'avons pas assez de suggestions, compléter avec des utilisateurs aléatoires
    if (suggestionsFromFollowing.length < minSuggestions) {
      const existingSuggestionIds = suggestionsFromFollowing.map(s => s._id);
      const remainingCount = minSuggestions - suggestionsFromFollowing.length;
      
      const randomSuggestions = await this.model.aggregate([
        {
          $match: {
            _id: { 
              $ne: userObjectId,
              $nin: [...followingIds, ...existingSuggestionIds]
            }
          }
        },
        {
          $project: {
            _id: 1,
            username: 1,
            identifier_name: 1,
            bio: 1,
            avatar: 1
          }
        },
        { $sample: { size: remainingCount } }
      ]);

      return [...suggestionsFromFollowing, ...randomSuggestions];
    }

    return suggestionsFromFollowing;
  }
}

const userRepository = new UserRepository();
export default userRepository;
