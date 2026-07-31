import { Bell } from "lucide-react"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        <div>
          <Badge variant="outline" className="mb-4 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">System</Badge>
          <h1 className="text-4xl font-serif tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay updated with your creative ecosystem.</p>
        </div>

        <Card className="border-border/50 shadow-[var(--shadow-float)]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-2xl bg-primary/10 mb-4">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-serif mb-2">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">When creators interact with your content, you&apos;ll see it here.</p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
