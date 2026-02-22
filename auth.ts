import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { LoginSchema } from '@/lib/validations/auth';

/**
 * 🧠 Architect note:
 * PrismaAdapter is intentionally OMITTED here.
 * When using JWT strategy with Credentials provider, the adapter is not needed
 * and causes a known conflict in NextAuth v5 beta where it tries to persist
 * sessions to DB even with strategy:'jwt'.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // 🛡️ Sentinel: Validate inputs
                const parsed = LoginSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                // 🔍 Find user — defensive: email already normalized by Zod
                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        passwordHash: true,
                        role: true,
                        image: true,
                    },
                });

                // 🛡️ Sentinel: No user or no hash → reject
                if (!user?.passwordHash) return null;

                // 🔒 Constant-time compare
                const passwordMatch = await bcrypt.compare(password, user.passwordHash);
                if (!passwordMatch) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { id: string; role?: string }).role ?? 'USER';
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string;
            }
            if (token?.role) {
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },
});
