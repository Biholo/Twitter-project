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
}

const userRepository = new UserRepository();
export default userRepository;
