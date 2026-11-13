'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plug, Link as LinkIcon, Unlink } from 'lucide-react'
import { toast } from 'sonner'

interface Service {
  id: string
  name: string
  icon: string
  connected: boolean
  connectedAt?: string
  account?: string
}

export function IntegrationsSettings() {
  const [metaAccounts, setMetaAccounts] = useState<Service[]>([])
  const [web3Wallets, setWeb3Wallets] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/users/me/integrations')

      if (res.ok) {
        const data = await res.json()
        setMetaAccounts(data.metaAccounts || [])
        setWeb3Wallets(data.web3Wallets || [])
      }
    } catch (error) {
      console.error('[Integrations] Error loading integrations:', error)
      toast.error('Failed to load integrations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (type: string) => {
    try {
      // Mock OAuth flow
      toast.success(`Connected ${type} successfully`)
      loadIntegrations()
    } catch (error) {
      console.error('[Integrations] Error connecting:', error)
      toast.error(`Failed to connect ${type}`)
    }
  }

  const handleDisconnect = async (id: string, type: string) => {
    try {
      const res = await fetch(`/api/users/me/integrations/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (res.ok) {
        toast.success('Disconnected successfully')
        loadIntegrations()
      } else {
        toast.error('Failed to disconnect')
      }
    } catch (error) {
      console.error('[Integrations] Error disconnecting:', error)
      toast.error('Error disconnecting')
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#121412] border-[#2a2826]">
        <CardContent className="pt-6 text-center text-[#6B8E6E]">
          Loading integrations...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Meta Accounts */}
      <Card className="bg-[#121412] border-[#2a2826] text-[#FFFFFF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-[#99FF33]" />
            Meta Integration
          </CardTitle>
          <CardDescription>Connect your Meta/Facebook account for ad management</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {metaAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B8E6E] mb-4">No Meta accounts connected</p>
              <Button
                onClick={() => handleConnect('Meta')}
                className="bg-[#99FF33] text-[#121412] hover:bg-[#99FF33]/90"
              >
                Connect Meta Account
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {metaAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#1a1918] border border-[#2a2826]"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-[#99FF33]" />
                      {account.account}
                    </h4>
                    <p className="text-xs text-[#6B8E6E]">
                      Connected on {account.connectedAt}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDisconnect(account.id, 'meta')}
                    className="border-[#2a2826] text-[#99FF33]"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => handleConnect('Meta')}
                variant="outline"
                className="w-full border-[#2a2826]"
              >
                Add Another Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Web3 Wallets */}
      <Card className="bg-[#121412] border-[#2a2826] text-[#FFFFFF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-[#99FF33]" />
            Web3 Wallets
          </CardTitle>
          <CardDescription>Connect your cryptocurrency wallets for blockchain transactions</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {web3Wallets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B8E6E] mb-4">No Web3 wallets connected</p>
              <Button
                onClick={() => handleConnect('Web3')}
                className="bg-[#99FF33] text-[#121412] hover:bg-[#99FF33]/90"
              >
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {web3Wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#1a1918] border border-[#2a2826]"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-[#99FF33]" />
                      {wallet.account}
                    </h4>
                    <p className="text-xs text-[#6B8E6E]">
                      Connected on {wallet.connectedAt}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDisconnect(wallet.id, 'web3')}
                    className="border-[#2a2826] text-[#99FF33]"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => handleConnect('Web3')}
                variant="outline"
                className="w-full border-[#2a2826]"
              >
                Add Another Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="bg-[#121412] border-[#2a2826] text-[#FFFFFF]">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API keys for developer access</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-[#6B8E6E] mb-4">
            API key management coming soon. This will allow developers to integrate with your account
            programmatically.
          </p>
          <Button variant="outline" disabled className="border-[#2a2826]">
            Create API Key (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
