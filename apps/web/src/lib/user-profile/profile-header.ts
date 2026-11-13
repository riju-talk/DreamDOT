import { prismaUser } from "@/lib/prisma/user"
import { prismaSocial } from "@/lib/prisma/social"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth";

export async function getUserProfile() {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const user = await prismaUser.users.findUnique({ where: { email: email || "" } })
    const id = user?.id
    const profile = await prismaUser.user_profile.findUnique({ where: { user_id: id } })

    const followers = await prismaSocial.following.findMany({ where: { followee_id: id } })
    const following = await prismaSocial.following.findMany({ where: { follower_id: id } })

    const profile_data ={
        username: profile?.username,
        display_name: profile?.display_name,
        avatar_url: profile?.avatar_url,
        banner_url: profile?.banner_url,
        bio: profile?.bio,
        location: profile?.country,
        website: profile?.website,
        social_links: profile?.social_links,
        dob: profile?.dob,
        followers: followers.length,
        following: following.length,
        join_date: user?.created_at
    }
    return profile_data
}


export async function getUserProfileFromID(id: string) {
    const user = await prismaUser.users.findUnique({ where: { id: id } })
    const profile = await prismaUser.user_profile.findUnique({ where: { user_id: id } })

    const followers = await prismaSocial.following.findMany({ where: { followee_id: id } })
    const following = await prismaSocial.following.findMany({ where: { follower_id: id } })

    const profile_data ={
        username: profile?.username,
        display_name: profile?.display_name,
        avatar_url: profile?.avatar_url,
        banner_url: profile?.banner_url,
        bio: profile?.bio,
        location: profile?.country,
        website: profile?.website,
        social_links: profile?.social_links,
        dob: profile?.dob,
        followers: followers.length,
        following: following.length,
        join_date: user?.created_at
    }
    return profile_data
}