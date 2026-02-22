'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { RegisterSchema } from '@/lib/validations/auth';

// 🧠 Architect: Strictly typed return — No any.
type ActionResult =
    | { success: true; message: string }
    | { success: false; error: string };

export async function registerUser(formData: FormData): Promise<ActionResult> {
    const raw = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    };

    // 🛡️ Sentinel: Validate
    const parsed = RegisterSchema.safeParse(raw);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message ?? 'Validation error';
        return { success: false, error: firstError };
    }

    const { name, email, password } = parsed.data;

    // 🛡️ Sentinel: Check for duplicate
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return { success: false, error: 'An account with this email already exists.' };
    }

    // 🔒 Hash password — 12 rounds
    const passwordHash = await bcrypt.hash(password, 12);

    // 👷 Builder: Create user
    await prisma.user.create({
        data: { name, email, passwordHash },
    });

    return { success: true, message: 'Account created! You can now sign in.' };
}
