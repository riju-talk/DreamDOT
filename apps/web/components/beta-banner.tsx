"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("beta-banner-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("beta-banner-dismissed", "true");
  };

  // Don't render anything on the server or if dismissed
  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2.5 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className="bg-primary-foreground/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            Beta
          </span>
          <p className="text-sm text-primary-foreground/90">
            You&apos;re using the beta version of DreamDot. Features are actively being developed.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1.5 hover:bg-primary-foreground/20 rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
