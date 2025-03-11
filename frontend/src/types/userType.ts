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
    roles: string[];
    updated_at: Date;
    username: string;
}