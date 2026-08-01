"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import {
  BarChart3,
  Zap,
  TrendingUp,
  Play,
  Pause,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Facebook,
  Instagram,
} from "lucide-react"
import { useState } from "react"

interface AdCampaign {
  id: string
  platform: "instagram" | "facebook"
  title: string
  budget: number
  spent: number
  status: "active" | "paused" | "completed" | "failed"
  reach: number
  impressions: number
  clicks: number
  createdDate: Date
  endDate?: Date
}

export default function AdStudioPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock campaigns
  const campaigns: AdCampaign[] = isConnected
    ? [
        {
          id: "1",
          platform: "instagram",
          title: "Summer Collection Launch",
          budget: 500,
          spent: 342,
          status: "active",
          reach: 12500,
          impressions: 45600,
          clicks: 1240,
          createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: "2",
          platform: "facebook",
          title: "Flash Sale - 48 Hours",
          budget: 300,
          spent: 300,
          status: "completed",
          reach: 8900,
          impressions: 32100,
          clicks: 890,
          createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: "3",
          platform: "instagram",
          title: "Brand Awareness Campaign",
          budget: 1000,
          spent: 0,
          status: "paused",
          reach: 0,
          impressions: 0,
          clicks: 0,
          createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ]
    : []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "paused":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "paused":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "completed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return ""
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Ad Studio</h1>
                <p className="text-muted-foreground">
                  Launch paid campaigns directly to Instagram & Facebook from DreamDOT
                </p>
              </div>
              {isConnected && (
                <Button onClick={() => setShowCreateModal(true)} className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              )}
            </div>
          </motion.div>

          {/* Not Connected State */}
          {!isConnected && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-dashed">
                <CardContent className="pt-12">
                  <div className="text-center space-y-6">
                    <div className="flex gap-4 justify-center">
                      <div className="w-16 h-16 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Facebook className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500/10 flex items-center justify-center">
                        <Instagram className="h-8 w-8 text-gradient-to-br from-purple-600 to-pink-600" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold mb-2">Connect Your Meta Account</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Link your Instagram or Facebook business account to launch advertising campaigns and reach your
                        audience
                      </p>
                    </div>

                    <div className="flex gap-4 justify-center pt-4">
                      <Button
                        onClick={() => setIsConnected(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Connect Facebook
                      </Button>
                      <Button onClick={() => setIsConnected(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white">
                        <Instagram className="h-4 w-4 mr-2" />
                        Connect Instagram
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground pt-4">
                      We only access the permissions needed to run your campaigns. Your data is encrypted and secure.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Connected State */}
          {isConnected && (
            <>
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-500">{campaigns.length}</p>
                      <p className="text-sm text-muted-foreground">Total Campaigns</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {campaigns.filter((c) => c.status === "active").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Active Now</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Reach</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        ${campaigns.reduce((sum, c) => sum + c.spent, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Campaign List */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold mb-6">Your Campaigns</h2>

                {campaigns.length === 0 ? (
                  <Card>
                    <CardContent className="pt-12 text-center pb-12">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Create your first ad campaign to start reaching your audience
                      </p>
                      <Button onClick={() => setShowCreateModal(true)}>Create Campaign</Button>
                    </CardContent>
                  </Card>
                ) : (
                  campaigns.map((campaign) => (
                    <motion.div key={campaign.id} variants={itemVariants}>
                      <Card className="hover:border-border transition-all">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {campaign.platform === "instagram" ? (
                                  <Instagram className="h-5 w-5 text-gradient-to-br from-purple-600 to-pink-600" />
                                ) : (
                                  <Facebook className="h-5 w-5 text-blue-600" />
                                )}
                                <CardTitle>{campaign.title}</CardTitle>
                                <Badge variant="outline" className={getStatusColor(campaign.status)}>
                                  {getStatusIcon(campaign.status)}
                                  <span className="ml-1 capitalize">{campaign.status}</span>
                                </Badge>
                              </div>
                              <CardDescription>
                                Created {campaign.createdDate.toLocaleDateString()} •{" "}
                                {campaign.platform.charAt(0).toUpperCase() + campaign.platform.slice(1)}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                {campaign.status === "active" ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-1" />
                                    Pause
                                  </>
                                ) : campaign.status === "paused" ? (
                                  <>
                                    <Play className="h-4 w-4 mr-1" />
                                    Resume
                                  </>
                                ) : null}
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Budget</p>
                              <p className="text-lg font-bold">${campaign.budget}</p>
                              <p className="text-xs text-muted-foreground">
                                ${campaign.spent} spent
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Reach</p>
                              <p className="text-lg font-bold">{campaign.reach.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Impressions</p>
                              <p className="text-lg font-bold">{campaign.impressions.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Clicks</p>
                              <p className="text-lg font-bold">{campaign.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">CTR</p>
                              <p className="text-lg font-bold">
                                {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-muted-foreground">Budget Usage</span>
                              <span className="text-xs font-semibold">
                                {((campaign.spent / campaign.budget) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{
                                  width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </>
          )}

          {/* Create Campaign Modal Placeholder */}
          {showCreateModal && isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-surface rounded-lg p-8 max-w-2xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
                <p className="text-muted-foreground mb-6">
                  Select a post, set your budget, choose your audience, and launch your campaign.
                </p>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button className="w-full bg-primary text-primary-foreground">
                    Continue to Builder
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
