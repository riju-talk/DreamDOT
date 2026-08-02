import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prismaUser } from "./prisma_user"
import { getServerSession } from "next-auth"
import type { NextAuthOptions } from "next-auth"
import jwt from "jsonwebtoken"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prismaUser.users.findUnique({
          where: { email: credentials.email },
          include: { user_profile: true },
        })

        if (!user || !user.password_hash) return null

        const isValid = await bcrypt.compare(credentials.password, user.password_hash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.user_profile?.display_name ?? "",
          avatar: user.user_profile?.avatar_url ?? "/placeholder.svg",
          username: user.user_profile?.username ?? "",
          verified: user.is_verified,
        }
      },
    }),
    ...(process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          allowDangerousEmailAccountLinking: true,
        })]
      : []),
    ...(process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === "true" && process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [GitHubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
          allowDangerousEmailAccountLinking: true,
        })]
      : []),
    ...(process.env.NEXT_PUBLIC_DISCORD_OAUTH_ENABLED === "true" && process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [DiscordProvider({
          clientId: process.env.DISCORD_CLIENT_ID,
          clientSecret: process.env.DISCORD_CLIENT_SECRET,
          allowDangerousEmailAccountLinking: true,
        })]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github" || account?.provider === "discord") {
        if (!user.email) return false;
        
        try {
          let dbUser = await prismaUser.users.findUnique({
            where: { email: user.email },
            include: { user_profile: true }
          });

          if (!dbUser) {
            const tempUsername = user.email.split('@')[0] + Math.random().toString(36).substring(7);
            dbUser = await prismaUser.users.create({
              data: {
                 email: user.email,
                 password_hash: "OAUTH_LOGIN_" + account.provider.toUpperCase(),
                 is_verified: true,
                 user_profile: {
                    create: {
                      username: tempUsername,
                      display_name: user.name || tempUsername,
                      avatar_url: user.image
                    }
                 }
              },
              include: { user_profile: true }
            });
          }

          // Map the database user object to the next-auth user object for the jwt token
          user.id = dbUser.id;
          user.username = dbUser.user_profile?.username ?? undefined;
          user.avatar = dbUser.user_profile?.avatar_url ?? undefined;
          user.verified = dbUser.is_verified ?? undefined;

          return true;
        } catch (error) {
          console.error("OAuth SignIn Error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user
        if (process.env.JWT_SECRET) {
          token.chatToken = jwt.sign(
            { 
              sub: user.id, 
              email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          )
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...token.user,
          username: token.user.username,
          name: token.user.name,
          email: token.user.email,
          image: token.user.avatar,
        }
        session.chatToken = token.chatToken
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // GitHub OAuth Callback: http://localhost:5000/api/auth/callback/github
  // Make sure this callback URL is registered in your GitHub OAuth app settings
}

export const auth = () => getServerSession(authOptions)
