

export interface Users {
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

export interface CustomerTickets{
    ticket_id: number,
    user_id: number,
    subject: string,
    description: string,
    status: string
    full_name: string; 
    created_at: "2025-01-28T12:30:00Z",  // Use createdAt in camelCase
    updated_at: "2025-01-29T12:30:00Z",  // Use updatedAt in camelCase
};
export interface TUser {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    image_url: string;
    role: string;
    password_hash: string; // corresponds to 'password_hash' in the schema
    is_verified: boolean; // corresponds to 'is_verified' in the schema
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}


export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    image_url: string;
    role: string;
    is_verified: boolean;
}

export interface CustomerTickets {
    ticket_id: number;
    user_id: number;
    subject: string;
    description: string;
    status: string;
    full_name: string; 
    created_at: "2025-01-28T12:30:00Z",  // Use createdAt in camelCase
    updated_at: "2025-01-29T12:30:00Z",  // Use updatedAt in camelCase
};
  