"use client"
import { Github } from "lucide-react"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <AuthenticatedLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-12"
      >
        {/* Heading */}
        <div className="text-center">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">About</Badge>
          <h2 className="text-4xl font-serif leading-tight">
            About the Author
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            A vision by <span className="font-semibold italic text-gradient">Rijusmit</span>. Architecting the future of digital expression.
          </p>
        </div>

        {/* Author sections */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-[var(--shadow-float)]">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-primary">The Visionary</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              Rijusmit is a dreamer, designer, and developer focused on breaking the barriers of traditional digital interaction.
              DreamDot is the culmination of a desire to create a weightless, organic space for creativity to flourish.
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-[var(--shadow-float)]">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-primary">The Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              Believing that minimalism is the bridge to inspiration, the creator has woven &ldquo;Organic Futurism&rdquo; into every pixel&mdash;
              balancing high-tech functionality with the fluid grace of nature.
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-[var(--shadow-float)]">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-primary">The Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              To empower every visionary with tools that feel like an extension of thought.
              DreamDot isn&apos;t just a platform; it&apos;s a creative atelier for the next generation of storytellers.
            </CardContent>
          </Card>
        </div>

        {/* Join Us CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-3xl p-8 text-center"
        >
          <h3 className="text-2xl font-serif mb-2">Connect with the Voice</h3>
          <p className="mb-6 text-muted-foreground">Follow the journey and contribute to the evolution of DreamDot.</p>
          <Button asChild className="shadow-[var(--shadow-glow)]">
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> Collaborate on GitHub
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </AuthenticatedLayout>
  )
}
