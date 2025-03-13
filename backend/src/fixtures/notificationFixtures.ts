import { Types } from 'mongoose';
import { NotificationType } from '@/models/notificationModel';
import { userFixtures } from './userFixture';
import { tweetFixtures } from './tweetFixtures';

export const notifications = [
  {
    _id: new Types.ObjectId(),
    type: NotificationType.LIKE,
    user_id: userFixtures[0]!._id,
    sender_id: userFixtures[1]!._id,
    message: `@${userFixtures[1]!.username} a aimé votre tweet`,
    source_id: tweetFixtures[0]!._id,
    source_type: 'Tweet',
    notification_date: new Date('2024-03-10T10:00:00Z'),
    is_read: false,
    created_at: new Date('2024-03-10T10:00:00Z'),
    updated_at: new Date('2024-03-10T10:00:00Z')
  },
  {
    _id: new Types.ObjectId(),
    type: NotificationType.LIKE,
    user_id: userFixtures[1]!._id,
    sender_id: userFixtures[0]!._id,
    message: `@${userFixtures[0]!.username} a aimé votre tweet`,
    source_id: tweetFixtures[0]!._id,
    source_type: 'Tweet',
    notification_date: new Date('2024-03-10T10:00:00Z'),
    is_read: false,
    created_at: new Date('2024-03-10T10:00:00Z'),
    updated_at: new Date('2024-03-10T10:00:00Z')
  },
  {
    _id: new Types.ObjectId(),
    type: NotificationType.NEW_FOLLOWER,
    user_id: userFixtures[2]!._id,
    sender_id: userFixtures[1]!._id,
    message: `@${userFixtures[1]!.username} vous suit désormais`,
    source_id: userFixtures[1]!._id,
    source_type: 'User',
    notification_date: new Date('2024-03-10T10:00:00Z'),
    is_read: false,
    created_at: new Date('2024-03-10T10:00:00Z'),
    updated_at: new Date('2024-03-10T10:00:00Z')
  },
  {
    _id: new Types.ObjectId(),
    type: NotificationType.RETWEET,
    user_id: userFixtures[1]!._id,
    sender_id: userFixtures[0]!._id,
    message: `@${userFixtures[0]!.username} a retweeté votre tweet`,
    source_id: tweetFixtures[0]!._id,
    source_type: 'Tweet',
    notification_date: new Date('2024-03-10T10:00:00Z'),
    is_read: false,
    created_at: new Date('2024-03-10T10:00:00Z'),
    updated_at: new Date('2024-03-10T10:00:00Z')
  }
]; 