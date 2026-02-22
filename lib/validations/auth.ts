import { z } from 'zod';

/**
 * 🛡️ Sentinel: RegisterSchema
 * Password policy: min 8 chars, 1 uppercase, 1 number, 1 special char.
 */
export const RegisterSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(60, 'Name too long')
        .transform(v => v.trim()),
    email: z
        .string()
        .email('Invalid email address')
        .transform(v => v.trim().toLowerCase()),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * 🛡️ Sentinel: LoginSchema
 * Validates presence and format only — bcrypt check happens in authorize().
 */
export const LoginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .transform(v => v.trim().toLowerCase()),
    password: z
        .string()
        .min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
