import { prismaUser } from "@/lib/prisma/user"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth";

export async function getUserAbout() {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const user = await prismaUser.users.findUnique({ where: { email: email || "" } })
    const id = user?.id
    const about = await prismaUser.user_about.findUnique({ where: { user_id: id } })

    const about_data = {
        about: about?.about,
        goals: about?.goals,
        skills: about?.skills,
    }
    return about_data
}