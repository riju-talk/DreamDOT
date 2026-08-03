import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export const useAuth = () => {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    signIn: (email: string, password: string) =>
      signIn("credentials", { email, password, redirect: false }),
    signInWithOAuth: (provider: "google" | "github" | "discord") =>
      signIn(provider),
    signOut: () => signOut({ redirect: true, callbackUrl: "/" }),
    updateSession: update,
  }
}
