"use client"

import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download
} from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { TopNav } from "../../../components/top-nav"
import { MOCK_ANALYTICS, generateSparkline } from "@/lib/mock-analytics"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex w-full h-screen overflow-hidden bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-auto relative">
          <TopNav />
          
          <main className="p-8 md:p-16 max-w-[1600px] mx-auto space-y-16">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
                  <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em]">Node: Creator Insights</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter text-foreground">
                  The <span className="text-foreground/30 not-italic">Mirror.</span>
                </h1>
                <p className="text-lg text-foreground/40 font-light max-w-md">
                  A reflection of your creative impact across the DreamDOT ecosystem.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" className="h-12 px-6 rounded-2xl bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.05] transition-all text-xs font-mono uppercase tracking-widest">
                  <Filter className="mr-2 h-4 w-4 opacity-40" />
                  Filter Stream
                </Button>
                <Button variant="outline" className="h-12 px-6 rounded-2xl bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.05] transition-all text-xs font-mono uppercase tracking-widest">
                  <Download className="mr-2 h-4 w-4 opacity-40" />
                  Export Artifact
                </Button>
              </div>
            </header>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Reach Over Time */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif italic text-foreground/50 px-2">Stream Velocity.</h3>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/[0.02] border border-foreground/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Last 12 Cycles</span>
                  </div>
                </div>
                
                <div className="h-[400px] w-full bg-foreground/[0.01] rounded-[48px] border border-foreground/[0.03] p-12 relative overflow-hidden group hover:border-primary/20 transition-colors duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30" />
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d={generateSparkline(MOCK_ANALYTICS.impressions, 1000, 300)} 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="drop-shadow-[0_0_10px_rgba(153,255,51,0.5)]"
                    />
                    <path 
                      d={`${generateSparkline(MOCK_ANALYTICS.impressions, 1000, 300)} L 1000 300 L 0 300 Z`}
                      fill="url(#chartGradient)"
                    />
                  </svg>
                  <div className="absolute bottom-8 left-12 right-12 flex justify-between text-[10px] font-mono text-foreground/20 uppercase tracking-[0.2em]">
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
              <div className="space-y-8">
                <h3 className="text-2xl font-serif italic text-foreground/50 px-2">Ecosystem.</h3>
                <div className="bg-foreground/[0.02] rounded-[48px] border border-foreground/[0.03] p-10 space-y-10 group hover:border-primary/20 transition-colors duration-1000 h-full">
                  <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.3em] mb-4">Audience Composition</p>
                  <div className="space-y-8">
                    {MOCK_ANALYTICS.demographics.map((item, i) => (
                      <div key={item.label} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-sm text-foreground/70 font-light">{item.label}</span>
                          <span className="text-xs font-mono text-primary/60">{item.value}%</span>
                        </div>
                        <div className="h-1 w-full bg-foreground/[0.05] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ delay: i * 0.1, duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-primary/40 rounded-full" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-10 mt-auto border-t border-foreground/5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-foreground/40 font-light italic">
                      "Your influence is growing exponentially among Digital Artists."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Artifacts Table */}
            <section className="space-y-10">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-3xl font-serif italic text-foreground/40">Highly Resonant Artifacts.</h3>
                <Button variant="link" className="text-primary font-mono text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100">Full Archive</Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {MOCK_ANALYTICS.topArtifacts.map((artifact, i) => (
                  <motion.div 
                    key={artifact.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col md:flex-row items-center justify-between p-8 bg-foreground/[0.01] hover:bg-foreground/[0.03] rounded-[32px] border border-foreground/5 hover:border-primary/20 transition-all duration-700 group cursor-pointer"
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className="w-16 h-16 rounded-2xl bg-foreground/[0.05] flex items-center justify-center font-serif text-2xl text-foreground/10 group-hover:text-primary transition-colors">
                        0{i + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-serif text-foreground leading-none group-hover:text-primary transition-colors">{artifact.title}</h4>
                        <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-[0.2em] mt-3">Artifact ID: {artifact.id}992X</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-16 mt-6 md:mt-0">
                      <div className="text-right">
                        <p className="text-2xl font-serif text-foreground/80">{artifact.views.toLocaleString()}</p>
                        <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest mt-1">Total Resonance</p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full border",
                        artifact.change > 0 ? "border-primary/20 text-primary bg-primary/5" : "border-red-500/20 text-red-500 bg-red-500/5"
                      )}>
                        {artifact.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
                        <span className="text-xs font-mono">{Math.abs(artifact.change)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
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
    <div className="bg-foreground/[0.01] backdrop-blur-3xl border border-foreground/[0.03] rounded-[40px] p-8 space-y-6 group hover:border-primary/20 transition-all duration-1000 relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-foreground/[0.03] flex items-center justify-center border border-white/5 transition-transform duration-700 group-hover:scale-110">
          <Icon className="w-5 h-5 text-primary/60" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase",
          negative ? "text-red-500/60" : "text-primary/60"
        )}>
          {negative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.3em]">{label}</p>
        <h4 className="text-3xl font-serif text-foreground tracking-tighter group-hover:text-primary transition-colors duration-700">{value}</h4>
      </div>

      <div className="h-12 w-full mt-4 relative z-10 opacity-30 group-hover:opacity-100 transition-opacity duration-1000">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
          <path 
            d={generateSparkline(data, 100, 30)} 
            fill="none" 
            stroke={negative ? "currentColor" : "var(--primary)"} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={negative ? "text-red-500" : ""}
          />
        </svg>
      </div>
    </div>
  )
}
