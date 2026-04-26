"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle, FaDiscord } from "react-icons/fa";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OAuthButtonsProps {
  isLoading?: boolean;
  googleEnabled?: boolean;
  githubEnabled?: boolean;
  discordEnabled?: boolean;
  callbackUrl?: string;
  mode?: "signin" | "signup";
}

export function OAuthButtons({ 
  isLoading = false,
  googleEnabled = false,
  githubEnabled = false,
  discordEnabled = false,
  callbackUrl = "/feed",
  mode = "signin",
}: OAuthButtonsProps) {
  const handleOAuthSignIn = async (provider: "google" | "github" | "discord") => {
    try {
      await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      toast.error("Authentication Error", {
        description: `Failed to sign in with ${provider}. Please try again.`,
      });
    }
  };

  // If no providers are enabled, don't render anything
  if (!googleEnabled && !githubEnabled && !discordEnabled) {
    return null;
  }

  const modeLabel = mode === "signup" ? "Create account with" : "Continue with";

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <span className="h-px bg-border/70 flex-1" />
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{modeLabel}</span>
        <span className="h-px bg-border/70 flex-1" />
      </div>

      <div className="flex flex-col space-y-2">
        {googleEnabled && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-card/70 hover:bg-accent/40 transition-colors"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaGoogle className="h-4 w-4 text-red-500" />}
            Google
          </Button>
        )}
        
        {githubEnabled && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-card/70 hover:bg-accent/40 transition-colors"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaGithub className="h-4 w-4" />}
            GitHub
          </Button>
        )}

        {discordEnabled && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-card/70 hover:bg-accent/40 transition-colors"
            onClick={() => handleOAuthSignIn("discord")}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaDiscord className="h-4 w-4 text-[#5865F2]" />}
            Discord
          </Button>
        )}
      </div>
    </>
  );
}
