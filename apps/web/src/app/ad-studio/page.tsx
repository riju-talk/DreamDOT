'use client'

import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Zap } from 'lucide-react'

export default function AdStudioPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        <div>
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
            UNDER DEVELOPMENT
          </Badge>
          <h1 className="text-4xl font-bold text-[#FFFFFF]">Ad Studio</h1>
          <p className="text-[#6B8E6E] mt-2">Launch paid ad campaigns through Meta (Instagram & Facebook)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <Card className="bg-[#121412] border-[#2a2826]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#99FF33]">
                  <Zap className="h-5 w-5" />
                  Meta Integration
                </CardTitle>
                <CardDescription>Coming Soon - Connect your Meta account</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="p-6 rounded-lg bg-[#1a1918] border border-[#2a2826] space-y-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#FFFFFF]">Feature Under Development</h3>
                      <p className="text-sm text-[#6B8E6E] mt-1">
                        The Ad Studio integration with Meta is currently under development. This feature will allow you to:
                      </p>
                      <ul className="text-sm text-[#6B8E6E] mt-3 space-y-2 ml-4">
                        <li>• Connect your Instagram/Facebook accounts</li>
                        <li>• Create paid ad campaigns from your posts</li>
                        <li>• Set budgets and target audiences</li>
                        <li>• Track campaign performance and ROI</li>
                        <li>• Manage campaigns from DreamDOT</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8 text-[#6B8E6E]">
                  <p className="text-sm">OAuth integration coming in next release</p>
                </div>

                <Button disabled className="w-full bg-[#99FF33]/30 text-[#99FF33] cursor-not-allowed">
                  Connect Meta Account (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <Card className="bg-[#121412] border-[#2a2826]">
            <CardHeader>
              <CardTitle className="text-lg">What's Included</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-[#99FF33]">Campaign Creation</p>
                <p className="text-[#6B8E6E] text-xs mt-1">Build ads directly from your posts</p>
              </div>

              <div className="h-px bg-[#2a2826]" />

              <div>
                <p className="font-semibold text-[#99FF33]">Budget Control</p>
                <p className="text-[#6B8E6E] text-xs mt-1">Set budgets in credits, transparent pricing</p>
              </div>

              <div className="h-px bg-[#2a2826]" />

              <div>
                <p className="font-semibold text-[#99FF33]">Audience Targeting</p>
                <p className="text-[#6B8E6E] text-xs mt-1">Target by location, age, interests</p>
              </div>

              <div className="h-px bg-[#2a2826]" />

              <div>
                <p className="font-semibold text-[#99FF33]">Performance Tracking</p>
                <p className="text-[#6B8E6E] text-xs mt-1">Real-time analytics and ROI</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
