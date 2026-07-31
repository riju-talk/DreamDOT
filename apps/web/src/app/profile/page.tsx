import { ProfileHeader } from "../../../components/profile-header"
import { ProfileTabs } from "../../../components/profile-tabs"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"

export default function ProfilePage() {
  return (
    <AuthenticatedLayout>
      <ProfileHeader />
      <ProfileTabs />
    </AuthenticatedLayout>
  )
}
