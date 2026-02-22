/**
 * 💀 The Exterminator — Auth Unit Tests
 * Run: npx vitest run __tests__/auth.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterSchema, LoginSchema } from '../lib/validations/auth';

// ── Zod Schema Tests (no DB required) ──────────────────────────────────────

describe('RegisterSchema', () => {
    it('passes with valid inputs', () => {
        const result = RegisterSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'SecurePass1!',
            confirmPassword: 'SecurePass1!',
        });
        expect(result.success).toBe(true);
    });

    it('rejects weak password (no uppercase)', () => {
        const result = RegisterSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password1!',
            confirmPassword: 'password1!',
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toContain('uppercase');
    });

    it('rejects password with no special character', () => {
        const result = RegisterSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password123',
            confirmPassword: 'Password123',
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toContain('special');
    });

    it('rejects mismatched confirmPassword', () => {
        const result = RegisterSchema.safeParse({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'SecurePass1!',
            confirmPassword: 'Different1!',
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.path).toContain('confirmPassword');
    });

    it('rejects invalid email format', () => {
        const result = RegisterSchema.safeParse({
            name: 'John Doe',
            email: 'not-an-email',
            password: 'SecurePass1!',
            confirmPassword: 'SecurePass1!',
        });
        expect(result.success).toBe(false);
    });

    it('rejects name shorter than 2 characters', () => {
        const result = RegisterSchema.safeParse({
            name: 'J',
            email: 'john@example.com',
            password: 'SecurePass1!',
            confirmPassword: 'SecurePass1!',
        });
        expect(result.success).toBe(false);
    });
});

describe('LoginSchema', () => {
    it('passes with valid email and password', () => {
        const result = LoginSchema.safeParse({
            email: 'john@example.com',
            password: 'anything',
        });
        expect(result.success).toBe(true);
    });

    it('rejects empty password', () => {
        const result = LoginSchema.safeParse({
            email: 'john@example.com',
            password: '',
        });
        expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
        const result = LoginSchema.safeParse({
            email: 'notanemail',
            password: 'Password1!',
        });
        expect(result.success).toBe(false);
    });

    it('normalises email to lowercase', () => {
        const result = LoginSchema.safeParse({
            email: 'JOHN@EXAMPLE.COM',
            password: 'Password1!',
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.email).toBe('john@example.com');
        }
    });
});

// ── Register Action Integration Tests (mocked Prisma) ─────────────────────

vi.mock('../lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('$2b$12$hashedpassword'),
        compare: vi.fn(),
    },
}));

describe('registerUser action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('successfully creates a new user', async () => {
        const { prisma } = await import('../lib/prisma');
        const { registerUser } = await import('../app/actions/register');

        (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
        (prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'abc123' });

        const formData = new FormData();
        formData.append('name', 'Jane Doe');
        formData.append('email', 'jane@example.com');
        formData.append('password', 'SecurePass1!');
        formData.append('confirmPassword', 'SecurePass1!');

        const result = await registerUser(formData);
        expect(result.success).toBe(true);
    });

    it('rejects duplicate email', async () => {
        const { prisma } = await import('../lib/prisma');
        const { registerUser } = await import('../app/actions/register');

        (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'existing' });

        const formData = new FormData();
        formData.append('name', 'Jane Doe');
        formData.append('email', 'dupe@example.com');
        formData.append('password', 'SecurePass1!');
        formData.append('confirmPassword', 'SecurePass1!');

        const result = await registerUser(formData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('already exists');
        }
    });

    it('rejects weak password via Zod', async () => {
        const { registerUser } = await import('../app/actions/register');

        const formData = new FormData();
        formData.append('name', 'Jane Doe');
        formData.append('email', 'jane@example.com');
        formData.append('password', 'weak');
        formData.append('confirmPassword', 'weak');

        const result = await registerUser(formData);
        expect(result.success).toBe(false);
    });
});
