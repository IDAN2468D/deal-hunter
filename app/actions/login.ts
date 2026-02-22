'use server';

import { signIn } from '@/auth';
import { LoginSchema } from '@/lib/validations/auth';
import { AuthError } from 'next-auth';

type ActionResult =
    | { success: true }
    | { success: false; error: string };

export async function loginUser(formData: FormData): Promise<ActionResult> {
    const raw = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    // 🛡️ Sentinel: Validate
    const parsed = LoginSchema.safeParse(raw);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message ?? 'Validation error';
        return { success: false, error: firstError };
    }

    try {
        await signIn('credentials', {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { success: false, error: 'Invalid email or password.' };
                default:
                    return { success: false, error: 'Something went wrong. Please try again.' };
            }
        }
        throw error;
    }
}
