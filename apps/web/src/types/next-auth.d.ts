import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name?: string
    avatar?: string
    handle?: string
    username?: string
    verified?: boolean | null
  }

  interface Session {
    user: User & DefaultSession["user"]
    chatToken?: string
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: import("next-auth").User
    chatToken?: string
    accessToken?: string
  }
}
