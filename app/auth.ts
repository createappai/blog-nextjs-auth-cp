import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyLogin } from "@/models/user.server";
import { User } from "@/models/user";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {},
      async authorize(credentials: { email?: string; password?: string }) {
        //
        if (!credentials?.email || !credentials?.password) return null;
        //
        try {
          const email = credentials?.email;
          const pwd = credentials?.password;
          if (email === "example@example.com" && pwd === "Example!234") {
            return {
              id: 1,
              userId: 1,
              email,
              isActiveFlag: true,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return (user as any).isActiveFlag;
    },
    async jwt({ token, user }) {
      if (!token.userId && user) {
        token.userId = (user as User).userId;
      }
      return token;
    },
    async session({ token, session, user }) {
      if (token) {
        if (session.user) {
          (session.user as any).userId = token.userId;
        } else {
          session.user = {
            // id: token.id,
            email: token.email,
            //@ts-ignore
            userId: token.userId,
          };
        }
      }
      return session;
    },
  },
};
