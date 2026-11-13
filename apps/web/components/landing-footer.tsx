import Link from "next/link"
import { Sparkles, Facebook, Twitter, Instagram, Github, Linkedin } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-foreground py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="relative overflow-hidden rounded-lg p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">DreamDOT</span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              Empowering creators worldwide with intuitive tools and a supportive community.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 text-base sm:text-lg">Platform</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/#features" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#questions" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Questions
                </Link>
              </li>
              <li>
                <Link href="" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 text-base sm:text-lg">Community</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/account" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  For Creators
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 text-base sm:text-lg">Connect</h4>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Github, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, index) => (
                <Link 
                  key={index} 
                  href={href} 
                  className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-950 rounded-full transition-all border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600"
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          © 2025 DreamDOT. All rights reserved. <span className="hidden sm:inline">|</span> <br className="sm:hidden" />
          <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy</Link>
          <span className="mx-2">•</span>
          <Link href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
