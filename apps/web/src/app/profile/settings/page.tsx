import { redirect } from "next/navigation"

// /profile/settings lives at /settings; keep the old path working instead of
// letting /profile/[userId] treat "settings" as a user id.
export default function ProfileSettingsRedirect() {
  redirect("/settings")
}
