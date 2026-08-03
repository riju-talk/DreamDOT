"use client"

import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3
} from "lucide-react"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { MOCK_ANALYTICS, generateSparkline } from "@/lib/mock-analytics"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#5a8c5a]/10 dark:bg-primary/10 text-[#5a8c5a] dark:text-primary">
              <BarChart3 className="size-5" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5a8c5a] dark:text-primary">
              Analytics
            </p>
          </div>
          <h1 className="font-serif text-4xl font-black italic text-slate-900 dark:text-slate-50">
            Creator Insights
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your performance and engagement across DreamDOT
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            label="Total Reach" 
            value={MOCK_ANALYTICS.reach.toLocaleString()} 
            trend="+12.4%" 
            icon={Users}
            data={MOCK_ANALYTICS.impressions.slice(-7)}
          />
          <MetricCard 
            label="Engagement Rate" 
            value={`${MOCK_ANALYTICS.engagement}%`} 
            trend="+2.1%" 
            icon={Zap}
            data={[6, 8, 5, 10, 8, 12, 9]}
          />
          <MetricCard 
            label="Revenue Generated" 
            value={`$${MOCK_ANALYTICS.monetization.total.toLocaleString()}`} 
            trend="+18.7%" 
            icon={DollarSign}
            data={MOCK_ANALYTICS.monetization.history.map(h => h.amount)}
          />
          <MetricCard 
            label="Artifact Views" 
            value="42.8K" 
            trend="-4.2%" 
            negative
            icon={TrendingUp}
            data={[10, 15, 12, 8, 14, 11, 13]}
          />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reach Over Time */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">Stream Velocity</h3>
            
            <div className="h-[320px] w-full bg-white/50 dark:bg-slate-900/30 rounded-xl border border-[#5a8c5a]/15 dark:border-primary/15 p-8 relative overflow-hidden group hover:border-[#5a8c5a]/30 dark:hover:border-primary/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-[#5a8c5a]/5 dark:from-primary/5 via-transparent to-transparent opacity-30" />
              <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5a8c5a" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#5a8c5a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={generateSparkline(MOCK_ANALYTICS.impressions, 1000, 300)} 
                  fill="none" 
                  stroke="#5a8c5a" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="drop-shadow-sm"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(90, 140, 90, 0.4))"
                  }}
                />
                <path 
                  d={`${generateSparkline(MOCK_ANALYTICS.impressions, 1000, 300)} L 1000 300 L 0 300 Z`}
                  fill="url(#chartGradient)"
                />
              </svg>
              <div className="absolute bottom-8 left-12 right-12 flex justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          {/* Distribution */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">Audience Breakdown</h3>
            <div className="bg-white/50 dark:bg-slate-900/30 rounded-xl border border-[#5a8c5a]/15 dark:border-primary/15 p-6 space-y-6 group hover:border-[#5a8c5a]/30 dark:hover:border-primary/30 transition-colors h-full">
              <div className="space-y-6">
                {MOCK_ANALYTICS.demographics.map((item, i) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className="text-xs font-semibold text-[#5a8c5a] dark:text-primary">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ delay: i * 0.1, duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-[#5a8c5a] dark:bg-primary rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Artifacts Table */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">Top Performing Content</h3>

          <div className="grid grid-cols-1 gap-3">
            {MOCK_ANALYTICS.topArtifacts.map((artifact, i) => (
              <motion.div 
                key={artifact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white/50 dark:bg-slate-900/30 hover:bg-white/70 dark:hover:bg-slate-900/50 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 hover:border-[#5a8c5a]/30 dark:hover:border-primary/30 transition-all group cursor-pointer gap-4 md:gap-8"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#5a8c5a]/10 dark:bg-primary/10 flex items-center justify-center font-bold text-sm text-[#5a8c5a] dark:text-primary flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate group-hover:text-[#5a8c5a] dark:group-hover:text-primary transition-colors">{artifact.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {artifact.id}992X</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="text-right flex-1 md:flex-none">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{artifact.views.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Resonance</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold whitespace-nowrap",
                    artifact.change > 0 
                      ? "border-[#5a8c5a]/20 dark:border-primary/20 text-[#5a8c5a] dark:text-primary bg-[#5a8c5a]/5 dark:bg-primary/5" 
                      : "border-red-500/20 dark:border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/5 dark:bg-red-500/5"
                  )}>
                    {artifact.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    <span>{Math.abs(artifact.change)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  )
}

function MetricCard({ label, value, trend, negative, icon: Icon, data }: { 
  label: string, 
  value: string, 
  trend: string, 
  negative?: boolean, 
  icon: any,
  data: number[]
}) {
  return (
    <div className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm border border-[#5a8c5a]/15 dark:border-primary/15 rounded-lg p-6 space-y-4 group hover:border-[#5a8c5a]/30 dark:hover:border-primary/30 transition-all relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5a8c5a]/5 dark:from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="w-10 h-10 rounded-lg bg-[#5a8c5a]/10 dark:bg-primary/10 flex items-center justify-center border border-[#5a8c5a]/20 dark:border-primary/20 transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-5 h-5 text-[#5a8c5a] dark:text-primary" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold tracking-wide uppercase",
          negative ? "text-red-600 dark:text-red-400" : "text-[#5a8c5a] dark:text-primary"
        )}>
          {negative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>

      <div className="space-y-1.5 relative z-10">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.1em]">{label}</p>
        <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#5a8c5a] dark:group-hover:text-primary transition-colors">{value}</h4>
      </div>

      <div className="h-10 w-full mt-3 relative z-10 opacity-40 group-hover:opacity-100 transition-opacity">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
          <path 
            d={generateSparkline(data, 100, 30)} 
            fill="none" 
            stroke={negative ? "currentColor" : "#5a8c5a"} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={cn(negative ? "text-red-600 dark:text-red-400" : "dark:text-primary")}
            style={{
              filter: negative 
                ? "drop-shadow(0 0 4px rgba(220, 38, 38, 0.3))" 
                : "drop-shadow(0 0 4px rgba(90, 140, 90, 0.3))"
            }}
          />
        </svg>
      </div>
    </div>
  )
}
