export enum NotificationType {
    FOLLOW = "follow",
    LIKE = "like",
    RETWEET = "retweet",
    COMMENT = "comment",
}


export interface Notification {
    _id: string;
    type: NotificationType;
    content: string;
    created_at: Date;
    read: boolean;
    sender: Sender;
}

export interface Sender {
    _id: string;
    username: string;
    identifier_name: string;
    avatar: string;
}

