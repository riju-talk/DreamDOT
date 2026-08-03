import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prismaUser } from "./prisma/user"
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

        try {
          const user = await prismaUser.users.findUnique({
            where: { email: credentials.email },
            include: { user_profile: true },
          })

          if (!user || !user.password_hash) return null

          // Skip password check for OAuth users
          if (user.password_hash.startsWith("OAUTH_LOGIN_")) return null

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
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github" || account?.provider === "discord") {
        if (!user.email) return false;
        
        try {
          let dbUser = await prismaUser.users.findUnique({
            where: { email: user.email },
            include: { user_profile: true }
          });

          if (!dbUser) {
            // Generate unique username
            const baseUsername = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
            let username = baseUsername;
            let counter = 1;
            
            // Ensure username is unique
            while (await prismaUser.user_profile.findUnique({ where: { username } }).catch(() => null)) {
              username = `${baseUsername}${counter}`;
              counter++;
            }

            // Create new user with OAuth
            dbUser = await prismaUser.users.create({
              data: {
                email: user.email,
                password_hash: `OAUTH_LOGIN_${account.provider.toUpperCase()}`,
                is_verified: true,
                user_profile: {
                  create: {
                    username,
                    display_name: user.name || username,
                    avatar_url: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                    bio: "",
                    banner_url: "https://www.mcentre.lk/frontend/assets/images/default-banner.png",
                  }
                }
              },
              include: { user_profile: true }
            });
          } else {
            // Update existing user if OAuth provider is new or profile incomplete
            if (!dbUser.user_profile?.avatar_url && user.image) {
              await prismaUser.user_profile.update({
                where: { user_id: dbUser.id },
                data: { avatar_url: user.image }
              });
            }
          }

          // Update user object with database info
          user.id = dbUser.id;
          user.username = dbUser.user_profile?.username;
          user.avatar = dbUser.user_profile?.avatar_url;
          user.verified = dbUser.is_verified;

          return true;
        } catch (error) {
          console.error(`OAuth SignIn Error (${account?.provider}):`, error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.avatar = user.avatar;
        token.verified = user.verified;
        token.provider = account?.provider;
        
        if (process.env.JWT_SECRET) {
          token.chatToken = jwt.sign(
            { 
              sub: user.id, 
              email: user.email,
              username: user.username 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.image = token.avatar;
        session.user.verified = token.verified;
      }
      session.chatToken = token.chatToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allowed redirect URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/feed";
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account?.provider) {
        console.log(`New ${account.provider} user created:`, user.email);
      }
    },
    async signOut({ token }) {
      console.log("User signed out:", token?.email);
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const auth = () => getServerSession(authOptions)
