import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { LandingPage } from "@/components/landing-page"

export default async function HomePage() {
  const session = await getServerSession()

  if (session?.user) {
    redirect("/feed")
  }

  return <LandingPage />
}


