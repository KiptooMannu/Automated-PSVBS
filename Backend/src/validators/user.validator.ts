import {z} from 'zod';

export const registerSchema = z.object({
    user_id: z.number().int().optional(),
    first_name: z.string().min(3).max(255),
    last_name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(6).max(255),
    role: z.enum(['user', 'admin','super_admin']).default('user'),
    username: z.string().min(1, "Username is required").optional(),
})

export const loginSchema = z.object({
    user_id: z.number().int().optional(),
    email: z.string().email(),
    password: z.string().min(6).max(255),
})
