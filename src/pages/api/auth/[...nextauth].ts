import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encode: async ({ secret, token }) => {
      const jwtClaims = {
        state: token?.state,
        id: token?.id,
        sub: token?.sub?.toString(),
        name: token?.name,
        email: token?.email,
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      };
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256' });
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jwt.verify(token as string, secret, {
        algorithms: ['HS256'],
      });
      return decodedToken as JWT;
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      const isUserSignedIn = user ? true : false;
      if (isUserSignedIn) {
        token.id = user?.id.toString();
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      const secret = process.env.NEXTAUTH_SECRET || '';
      const encodedToken = jwt.sign(token, secret, { algorithm: 'HS256' });

      if (session.user) {
        session.user.id = token.id as string;
        session.token = encodedToken;
      }
      return Promise.resolve(session);
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
};

export default NextAuth(authOptions);
