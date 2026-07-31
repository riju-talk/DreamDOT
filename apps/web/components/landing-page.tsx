"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
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
    },
    {
      icon: Music,
      title: "Audio & Music",
      description: "Distribute your tracks and reach millions of listeners globally",
    },
    {
      icon: Palette,
      title: "Visual Arts",
      description: "Showcase your designs, photography, and digital creations",
    },
    {
      icon: Code,
      title: "Digital Assets",
      description: "Sell code, templates, and tools to eager developers and makers",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1f", color: "#ffffff", overflow: "hidden" }}>
      {/* Animated background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.4,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 70%, rgba(0, 255, 0, 0.2) 0%, transparent 60%)",
            filter: "blur(80px)",
            opacity: 0.2,
            transform: `translateY(${scrollY * -0.3}px)`,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Navigation */}
        <nav style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          backgroundColor: "rgba(10, 15, 31, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0, 255, 0, 0.2)",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
              <div style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "0.75rem",
                padding: "0.5rem",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)",
                transition: "all 500ms",
                cursor: "pointer",
              }}>
                <Sparkles style={{ width: "1.25rem", height: "1.25rem", color: "#00ff00" }} />
              </div>
              <span style={{
                fontFamily: "serif",
                fontStyle: "italic",
                fontSize: "1.5rem",
                fontWeight: "bold",
                letterSpacing: "-0.05em",
                color: "#00ff00",
                textDecoration: "none",
              }}>
                DreamDOT
              </span>
            </Link>

            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <Link href="#features" style={{ color: "#a3a3a3", textDecoration: "none", transition: "color 200ms" }}>Features</Link>
              <Link href="#benefits" style={{ color: "#a3a3a3", textDecoration: "none", transition: "color 200ms" }}>Why Us</Link>
              <Link href="#stats" style={{ color: "#a3a3a3", textDecoration: "none", transition: "color 200ms" }}>Success</Link>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "2px solid #00ff00",
                backgroundColor: "transparent",
                color: "#00ff00",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 200ms",
              }}>
                Sign In
              </button>
              <button style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                backgroundColor: "#00ff00",
                color: "#0a0f1f",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 200ms",
              }}>
                Get Started Free
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", paddingTop: "5rem" }}>
          <motion.div
            style={{ textAlign: "center", maxWidth: "56rem", margin: "0 auto" }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} style={{ marginBottom: "1.5rem" }}>
              <span style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "2px solid #00ff00",
                color: "#00ff00",
                backgroundColor: "rgba(0, 255, 0, 0.1)",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}>
                ✨ The Creator Revolution
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: "3.75rem",
                fontWeight: "900",
                marginBottom: "1.5rem",
                fontFamily: "serif",
                lineHeight: "1.2",
              }}
            >
              Unbind{" "}
              <span style={{ color: "#00ff00", fontStyle: "italic" }}>
                Thought.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: "1.25rem",
                marginBottom: "2rem",
                lineHeight: "1.5",
                color: "#d4d4d8",
              }}
            >
              Join millions of creators earning on their own terms. Sell digital products, build your audience, and reach true financial freedom.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button style={{
                padding: "1.5rem 2rem",
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: "#00ff00",
                color: "#0a0f1f",
                fontWeight: "700",
                fontSize: "1.125rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 200ms",
              }}>
                Launch Your Store
                <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
              </button>
              <button style={{
                padding: "1.5rem 2rem",
                borderRadius: "0.5rem",
                border: "2px solid #00ff00",
                backgroundColor: "transparent",
                color: "#00ff00",
                fontWeight: "700",
                fontSize: "1.125rem",
                cursor: "pointer",
                transition: "all 200ms",
              }}>
                Watch Demo
              </button>
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              variants={itemVariants}
              style={{
                marginTop: "4rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {[
                { emoji: "⚡", text: "Instant Payouts" },
                { emoji: "🌍", text: "Global Reach" },
                { emoji: "🎨", text: "Full Creative Control" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  style={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    border: "2px solid rgba(0, 255, 0, 0.3)",
                    backgroundColor: "rgba(0, 255, 0, 0.05)",
                    backdropFilter: "blur(10px)",
                    cursor: "pointer",
                  }}
                  whileHover={{ y: -5 }}
                >
                  <span style={{ fontSize: "1.875rem" }}>{item.emoji}</span>
                  <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "#d4d4d8" }}>{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section id="stats" style={{ padding: "5rem 1rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "4rem",
                color: "#00ff00",
              }}
            >
              The Numbers Speak
            </motion.h2>

            <motion.div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "2rem",
              }}
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
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      borderRadius: "1rem",
                      border: "2px solid rgba(0, 255, 0, 0.3)",
                      backgroundColor: "rgba(0, 255, 0, 0.05)",
                      transition: "all 200ms",
                      cursor: "pointer",
                    }}
                  >
                    <Icon style={{ width: "2rem", height: "2rem", color: "#00ff00", margin: "0 auto 1rem" }} />
                    <p style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#ffffff" }}>{stat.value}</p>
                    <p style={{ color: "#a3a3a3" }}>{stat.label}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ padding: "5rem 1rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "4rem",
                color: "#00ff00",
              }}
            >
              Your Creative Canvas
            </motion.h2>

            <motion.div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
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
                    style={{
                      padding: "2rem",
                      borderRadius: "1rem",
                      border: "2px solid rgba(0, 255, 0, 0.3)",
                      backgroundColor: "rgba(0, 255, 0, 0.05)",
                      transition: "all 200ms",
                      cursor: "pointer",
                    }}
                    whileHover={{ y: -10, borderColor: "rgba(0, 255, 0, 0.6)" }}
                  >
                    <div style={{
                      marginBottom: "1rem",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "rgba(0, 255, 0, 0.1)",
                      width: "fit-content",
                    }}>
                      <Icon style={{ width: "1.5rem", height: "1.5rem", color: "#00ff00" }} />
                    </div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#ffffff" }}>{feature.title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "#a3a3a3" }}>{feature.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="benefits" style={{ padding: "5rem 1rem" }}>
          <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                borderRadius: "1.5rem",
                border: "2px solid rgba(0, 255, 0, 0.3)",
                backgroundColor: "rgba(0, 255, 0, 0.05)",
                padding: "3rem",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <h2 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#ffffff" }}>Ready to Transform?</h2>
              <p style={{ fontSize: "1.25rem", marginBottom: "2rem", color: "#d4d4d8" }}>
                Join thousands of creators already earning more, reaching further, and building their legacy.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem" }}>
                {[
                  "95% Revenue Share",
                  "Weekly Payouts",
                  "24/7 Support",
                  "Marketing Tools",
                ].map((benefit, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d4d4d8" }}>
                    <CheckCircle2 style={{ width: "1.25rem", height: "1.25rem", color: "#00ff00" }} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <button style={{
                padding: "1.5rem 2.5rem",
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: "#00ff00",
                color: "#0a0f1f",
                fontWeight: "700",
                fontSize: "1.125rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "0 auto",
                transition: "all 200ms",
              }}>
                Start Creating Today
                <Rocket style={{ width: "1.25rem", height: "1.25rem" }} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(0, 255, 0, 0.2)", padding: "3rem 1rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", textDecoration: "none", color: "#00ff00" }}>
                  <Sparkles style={{ width: "1.25rem", height: "1.25rem", color: "#00ff00" }} />
                  <span style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#00ff00" }}>DreamDOT</span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#a3a3a3" }}>Empower creators worldwide.</p>
              </div>

              {[
                { title: "Product", links: ["Features", "Pricing", "Security"] },
                { title: "Company", links: ["About", "Blog", "Press"] },
                { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 style={{ fontWeight: "600", marginBottom: "1rem", color: "#00ff00" }}>{col.title}</h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {col.links.map((link, j) => (
                      <li key={j}>
                        <Link href="#" style={{ fontSize: "0.875rem", color: "#a3a3a3", textDecoration: "none", transition: "color 200ms" }}>
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(0, 255, 0, 0.2)", paddingTop: "2rem", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.875rem", color: "#a3a3a3" }}>
              <p>&copy; 2024 DreamDOT. All rights reserved.</p>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                {["Twitter", "Discord", "GitHub"].map((social, i) => (
                  <Link key={i} href="#" style={{ color: "#a3a3a3", textDecoration: "none", transition: "color 200ms" }}>
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
