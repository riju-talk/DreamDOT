import { prismaUser } from "@/lib/prisma/user"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function updateUserAbout(formData: FormData) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  if (!email) throw new Error("User not authenticated")

  const user = await prismaUser.users.findUnique({
    where: { email },
    select: { id: true },
  })

  if (!user) throw new Error("User not found")

  const about = formData.get("about") as string
  const goals = formData.get("goals") as string
  const skillsRaw = formData.getAll("skills") as string[] | string
  const skills = Array.isArray(skillsRaw)
    ? skillsRaw
    : skillsRaw?.split(",").map((s) => s.trim()) ?? []

  // UPSERT the user_about record
  await prismaUser.user_about.upsert({
    where: { user_id: user.id },
    update: { about, goals, skills },
    create: {
      user_id: user.id,
      about,
      goals,
      skills,
    },
  })
}
