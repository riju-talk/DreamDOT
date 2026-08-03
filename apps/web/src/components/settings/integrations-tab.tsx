"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link2, Unlink2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Session } from "next-auth"

interface IntegrationsSettingsTabProps {
  user?: Session["user"]
}

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  connecting: boolean
}

export function IntegrationsSettingsTab({ user }: IntegrationsSettingsTabProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "meta",
      name: "Meta / Facebook",
      description: "Connect your Meta/Facebook account for ad management",
      icon: "📘",
      connected: false,
      connecting: false,
    },
    {
      id: "web3",
      name: "Web3 Wallet",
      description: "Connect your cryptocurrency wallets for blockchain transactions",
      icon: "⛓️",
      connected: false,
      connecting: false,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Connect Stripe for payment processing",
      icon: "💳",
      connected: false,
      connecting: false,
    },
    {
      id: "github",
      name: "GitHub",
      description: "Connect GitHub for developer integrations",
      icon: "🐙",
      connected: false,
      connecting: false,
    },
  ])

  const handleConnect = async (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId ? { ...int, connecting: true } : int
      )
    )

    try {
      // TODO: Implement API call to connect integration
      // POST /api/integrations/[integrationId]/connect
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === integrationId
            ? { ...int, connected: true, connecting: false }
            : int
        )
      )

      toast.success(`${integrations.find((i) => i.id === integrationId)?.name} connected successfully`)
    } catch (error) {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === integrationId ? { ...int, connecting: false } : int
        )
      )
      toast.error("Failed to connect integration")
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    try {
      // TODO: Implement API call to disconnect integration
      // DELETE /api/integrations/[integrationId]/disconnect
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === integrationId ? { ...int, connected: false } : int
        )
      )

      toast.success(`${integrations.find((i) => i.id === integrationId)?.name} disconnected`)
    } catch (error) {
      toast.error("Failed to disconnect integration")
    }
  }

  return (
    <div className="space-y-6">
      {/* Connected Services */}
      <div className="mb-8">
        <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50 mb-4">
          Connected Services
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Manage your external service integrations and connected accounts
        </p>

        <div className="grid grid-cols-1 gap-4">
          {integrations.map((integration) => (
            <Card
              key={integration.id}
              className={`border transition-colors ${
                integration.connected
                  ? "border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10"
                  : "border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20"
              } p-6 shadow-sm backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{integration.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-50">
                      {integration.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {integration.description}
                    </p>
                    {integration.connected && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="size-2 rounded-full bg-green-600 dark:bg-green-400" />
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">
                          Connected
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {integration.connected ? (
                  <Button
                    onClick={() => handleDisconnect(integration.id)}
                    variant="outline"
                    className="h-10 rounded-full border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <Unlink2 className="size-4 mr-2" />
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnect(integration.id)}
                    disabled={integration.connecting}
                    className="h-10 rounded-full bg-[#5a8c5a] dark:bg-primary text-white dark:text-primary-foreground hover:bg-[#4a7c4a] dark:hover:bg-primary/90"
                  >
                    {integration.connecting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="size-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* API Access */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
            API Access
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage API keys for developer access
          </p>
        </div>

        <div className="p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            API key management coming soon. This will allow developers to integrate with your account programmatically.
          </p>
          <Button
            disabled
            className="h-10 rounded-full bg-[#5a8c5a]/50 dark:bg-primary/50 text-white dark:text-primary-foreground cursor-not-allowed"
          >
            Generate API Key
          </Button>
        </div>
      </Card>

      {/* Webhook Settings */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
            Webhook Events
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Receive real-time notifications for account events
          </p>
        </div>

        <div className="p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Webhook configuration coming soon. Configure endpoints to receive event notifications.
          </p>
          <Button
            disabled
            className="h-10 rounded-full bg-[#5a8c5a]/50 dark:bg-primary/50 text-white dark:text-primary-foreground cursor-not-allowed"
          >
            Configure Webhooks
          </Button>
        </div>
      </Card>
    </div>
  )
}
