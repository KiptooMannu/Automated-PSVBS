export interface TUser {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    image_url: string;
    role: string;
    password: string;
    isVerified: boolean;
}

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string,
    role: string;
    image_url: string;
}

export interface UserState {
    token: string | null;
    user: User | null;
}