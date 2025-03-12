export interface User {
    _id: string;
    accept_notifications: boolean;
    avatar?: string;
    banner_photo?: string;
    bio?: string;
    created_at: Date;
    email: string;
    identifier_name: string;
    is_email_confirmed: boolean;
    last_login_at: Date;
    registration_date: Date;
    website_link?: string | null;
    roles: string[];
    updated_at: Date;
    username: string;
}

export interface UserSuggestion {
    _id: string;
    username: string;
    avatar: string;
    bio: string;
    identifier_name: string;
}

export interface  UpdateUser {
    _id?: string;
    username: string;
    identifier_name: string;
    email: string;
    bio?: string;
    website_link?: string | null;
}


export interface UserList {
    _id: string;
    username: string;
    avatar: string;
    bio: string;
    identifier_name: string
}
