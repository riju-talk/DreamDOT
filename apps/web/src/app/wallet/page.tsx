import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { WalletClient } from "./components/WalletClient"

export const dynamic = "force-dynamic"

export default function WalletPage() {
  return (
    <AuthenticatedLayout>
      <WalletClient />
    </AuthenticatedLayout>
  )
}
