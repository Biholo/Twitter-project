import Follow, { IFollow } from "@/models/followModel";
import { BaseRepository } from "./baseRepository";
import { Types } from "mongoose";
import User from "@/models/userModel";

class FollowRepository extends BaseRepository<IFollow> {
  constructor() {
    super(Follow);
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 10, currentUserId?: string) {
    const skip = (page - 1) * limit;
    
    const followers = await Follow.aggregate([
      { $match: { following_id: new Types.ObjectId(userId) } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'follower_id',
          foreignField: '_id',
          as: 'follower'
        }
      },
      { $unwind: '$follower' },
      {
        $lookup: {
          from: 'follows',
          let: { followerId: '$follower._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$following_id', '$$followerId'] },
                    { $eq: ['$follower_id', new Types.ObjectId(currentUserId)] }
                  ]
                }
              }
            }
          ],
          as: 'isFollowing'
        }
      },
      {
        $project: {
          _id: '$follower._id',
          identifier_name: '$follower.identifier_name',
          username: '$follower.username',
          avatar: '$follower.avatar',
          isFollowing: { $gt: [{ $size: '$isFollowing' }, 0] }
        }
      }
    ]);

    const total = await Follow.countDocuments({ following_id: userId });

    return {
      followers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getFollowings(userId: string, page: number = 1, limit: number = 10, currentUserId?: string) {
    const skip = (page - 1) * limit;
    
    const followings = await Follow.aggregate([
      { $match: { follower_id: new Types.ObjectId(userId) } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'following_id',
          foreignField: '_id',
          as: 'following'
        }
      },
      { $unwind: '$following' },
      {
        $lookup: {
          from: 'follows',
          let: { followingId: '$following._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$following_id', '$$followingId'] },
                    { $eq: ['$follower_id', new Types.ObjectId(currentUserId)] }
                  ]
                }
              }
            }
          ],
          as: 'isFollowing'
        }
      },
      {
        $project: {
          _id: '$following._id',
          identifier_name: '$following.identifier_name',
          username: '$following.username',
          avatar: '$following.avatar',
          isFollowing: { $gt: [{ $size: '$isFollowing' }, 0] }
        }
      }
    ]);

    const total = await Follow.countDocuments({ follower_id: userId });

    return {
      followings,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

const followRepository = new FollowRepository();
export default followRepository;
