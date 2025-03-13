export enum NotificationType {
    FOLLOW = "follow",
    LIKE = "like",
    RETWEET = "retweet",
    COMMENT = "comment",
}


export interface Notification {
    _id: string;
    type: 'LIKE' | 'RETWEET' | 'REPLY' | 'NEW_FOLLOWER' | 'MENTION';
    message: string;
    is_read: boolean;
    user_id: string;
    sender_id: Sender;
    notification_date: string;
    __v: number;
  }

export interface Sender {
    _id: string;
    username: string;
    identifier_name: string;
    avatar: string;
}

