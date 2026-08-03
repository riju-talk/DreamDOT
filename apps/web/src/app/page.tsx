import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LandingPage } from "@/components/landing-page"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If authenticated, redirect to feed
  if (session?.user) {
    redirect("/feed")
  }

  // Show landing page for unauthenticated users
  return <LandingPage />
}


