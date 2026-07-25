import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from '@/lib/db';
import { env } from '@/lib/env';

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_APP_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false,
      },
      plan: {
        type: 'string',
        required: false,
        defaultValue: 'FREE',
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
