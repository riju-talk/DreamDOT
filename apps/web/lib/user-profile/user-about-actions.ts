"use server"

import { revalidatePath } from "next/cache"
import { updateUserAbout } from "@/lib/user-profile/user-about-edits"

export async function handleUpdateUserAbout(formData: FormData) {
  await updateUserAbout(formData)
  revalidatePath("/profile")
}
