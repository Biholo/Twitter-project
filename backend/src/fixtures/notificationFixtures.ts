import { Types } from 'mongoose';
import { NotificationType } from '@/models/notificationModel';
import { userFixtures } from './userFixture';
import { tweetFixtures } from './tweetFixtures';

export const notifications = [
  {
    _id: new Types.ObjectId(),
    type: NotificationType.LIKE,
    user_id: userFixtures[0]!._id,
    message: `@${userFixtures[1]!.username} a aimé votre tweet`,
    tweet: tweetFixtures[0]!._id,
    created_at: new Date('2024-03-10T10:00:00Z'),
    notification_date: new Date('2024-03-10T10:00:00Z'),
    is_read: false
  },
  {
    _id: new Types.ObjectId(),
    type: NotificationType.LIKE,
    user_id: userFixtures[1]!._id,
    message: `@${userFixtures[1]!.username} a aimé votre tweet`,    
    tweet: tweetFixtures[0]!._id,
    created_at: new Date('2024-03-10T10:00:00Z'),
    notification_date: new Date('2024-03-10T10:00:00Z'),
    is_read: false
  },
  {
    _id: new Types.ObjectId(),
    type: NotificationType.LIKE,
    user_id: userFixtures[2]!._id,
    message: `@${userFixtures[1]!.username} a aimé votre tweet`,    
    tweet: tweetFixtures[0]!._id,
    created_at: new Date('2024-03-10T10:00:00Z'),
    notification_date: new Date('2024-03-10T10:00:00Z'),
    is_read: false
  },
  {
    _id: new Types.ObjectId(),
    type: NotificationType.LIKE,
    user_id: userFixtures[1]!._id,
    message: `@${userFixtures[0]!.username} a aimé votre tweet`,    
    tweet: tweetFixtures[0]!._id,
    created_at: new Date('2024-03-10T10:00:00Z'),
    notification_date: new Date('2024-03-10T10:00:00Z'),
    is_read: false,
  }
]; 