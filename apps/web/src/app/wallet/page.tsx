import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { Wallet, History } from "lucide-react"

export default function WalletPage() {
    return (
        <AuthenticatedLayout>
            <div className="space-y-8">
                <div>
                    <Badge variant="outline" className="mb-4 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">Vault</Badge>
                    <h1 className="text-4xl font-serif tracking-tight">Wallet</h1>
                    <p className="text-muted-foreground mt-2">Manage your earnings and transactions on DreamDot.</p>
                </div>

                <div className="glass-panel rounded-2xl p-6 border-primary/10 bg-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                        <p className="text-sm font-medium text-primary">This feature is still in production</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Manage your earnings and transactions on DreamDot. Coming soon!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-border/50 shadow-[var(--shadow-float)]">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10">
                                    <Wallet className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg font-serif">Balance</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Coming soon...</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-[var(--shadow-float)]">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10">
                                    <History className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg font-serif">Transaction History</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Coming soon...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
