"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
  Rocket,
  ArrowRight,
  Globe,
  Palette,
  Code,
  Music,
  PenTool,
  CheckCircle2,
} from "lucide-react"

export function LandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const stats = [
    { value: "2.4M+", label: "Creators", icon: Users },
    { value: "$50M+", label: "Earnings", icon: TrendingUp },
    { value: "98%", label: "Satisfaction", icon: CheckCircle2 },
    { value: "95%", label: "Revenue Share", icon: Zap },
  ]

  const features = [
    {
      icon: PenTool,
      title: "Write & Publish",
      description: "Share your stories, articles, and ideas with the world instantly",
      color: "from-blue-500/20 to-transparent",
    },
    {
      icon: Music,
      title: "Audio & Music",
      description: "Distribute your tracks and reach millions of listeners globally",
      color: "from-purple-500/20 to-transparent",
    },
    {
      icon: Palette,
      title: "Visual Arts",
      description: "Showcase your designs, photography, and digital creations",
      color: "from-pink-500/20 to-transparent",
    },
    {
      icon: Code,
      title: "Digital Assets",
      description: "Sell code, templates, and tools to eager developers and makers",
      color: "from-green-500/20 to-transparent",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-tl from-pink-600/20 via-transparent to-blue-600/20 blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.3}px)` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-md z-50 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative overflow-hidden rounded-xl p-2 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-blue-400/70">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif italic text-2xl text-white font-bold tracking-tighter group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                DreamDOT
              </span>
            </Link>

            <div className="hidden md:flex gap-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#benefits" className="text-gray-300 hover:text-white transition-colors">
                Why Us
              </Link>
              <Link href="#stats" className="text-gray-300 hover:text-white transition-colors">
                Success
              </Link>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 text-white font-semibold">
                Get Started Free
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 text-sm font-semibold text-blue-300">
                ✨ The Creator Revolution
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 font-serif"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create. Monetize.
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Dominate.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            >
              Join millions of creators earning on their own terms. Sell digital products, build your audience, and reach true financial freedom.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4 flex-wrap justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/50 text-white font-bold text-lg px-8 py-6"
              >
                Launch Your Store
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/5 font-bold text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { emoji: "⚡", text: "Instant Payouts" },
                { emoji: "🌍", text: "Global Reach" },
                { emoji: "🎨", text: "Full Creative Control" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <p className="text-sm text-gray-300 mt-2">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              The Numbers Speak
            </motion.h2>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-blue-500/50 transition-all group"
                  >
                    <Icon className="h-8 w-8 text-blue-400 mx-auto mb-4 group-hover:text-purple-400 transition-colors" />
                    <p className="text-4xl md:text-5xl font-bold mb-2 text-white">{stat.value}</p>
                    <p className="text-gray-400">{stat.label}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Your Creative Canvas
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className={`p-8 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/10 hover:border-white/30 transition-all hover:shadow-2xl hover:shadow-blue-500/20 group cursor-pointer`}
                    whileHover={{ y: -10 }}
                  >
                    <div className="mb-4 p-4 rounded-xl bg-white/10 w-fit group-hover:bg-white/20 transition-colors">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="benefits" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/20 backdrop-blur-sm p-12 text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Ready to Transform?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of creators already earning more, reaching further, and building their legacy.
              </p>

              <div className="flex gap-4 flex-wrap justify-center mb-12">
                {[
                  "95% Revenue Share",
                  "Weekly Payouts",
                  "24/7 Support",
                  "Marketing Tools",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/50 text-white font-bold text-lg px-10 py-6"
              >
                Start Creating Today
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <Link href="/" className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span className="font-serif italic text-lg font-bold">DreamDOT</span>
                </Link>
                <p className="text-gray-400 text-sm">Empower creators worldwide.</p>
              </div>

              {[
                { title: "Product", links: ["Features", "Pricing", "Security"] },
                { title: "Company", links: ["About", "Blog", "Press"] },
                { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="font-semibold mb-4">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((link, j) => (
                      <li key={j}>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <p>&copy; 2024 DreamDOT. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                {["Twitter", "Discord", "GitHub"].map((social, i) => (
                  <Link key={i} href="#" className="hover:text-white transition-colors">
                    {social}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
