import { redirect } from "next/navigation"

// The "vault" is the user's purchased/owned items, which is the Library page.
export default function VaultRedirect() {
  redirect("/library")
}
