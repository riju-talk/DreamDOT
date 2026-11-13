"use server"

import { revalidatePath } from "next/cache"
import { updateUserAbout } from "@/lib/user-profile/user-about-edits"
import { getUserAbout } from "@/lib/user-profile/user-about"
import { prismaUser } from "@/lib/prisma/user"

export async function handleUpdateUserAbout(formData: FormData) {
  await updateUserAbout(formData)
  revalidatePath("/profile")
}

export async function getUserAboutAction(userId?: string) {
  if (userId) {
    const about = await prismaUser.user_about.findUnique({
      where: { user_id: userId },
    })
    return { about: about?.about, goals: about?.goals, skills: about?.skills }
  }
  return getUserAbout()
}
