"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle, FaDiscord } from "react-icons/fa";
import { toast } from "sonner";

interface OAuthButtonsProps {
  isLoading?: boolean;
  googleEnabled?: boolean;
  githubEnabled?: boolean;
  discordEnabled?: boolean;
}

export function OAuthButtons({ 
  isLoading = false,
  googleEnabled = false,
  githubEnabled = false,
  discordEnabled = false,
}: OAuthButtonsProps) {
  const handleOAuthSignIn = async (provider: "google" | "github" | "discord") => {
    try {
      await signIn(provider, {
        callbackUrl: "/feed",
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

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <span className="h-px bg-border flex-1" />
        <span className="text-sm text-muted-foreground">or sign in with</span>
        <span className="h-px bg-border flex-1" />
      </div>

      <div className="flex flex-col space-y-2">
        {googleEnabled && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-muted/50 transition-colors"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            type="button"
          >
            <FaGoogle className="h-4 w-4 text-red-500" />
            Sign in with Google
          </Button>
        )}
        
        {githubEnabled && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-muted/50 transition-colors"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
            type="button"
          >
            <FaGithub className="h-4 w-4" />
            Sign in with GitHub
          </Button>
        )}

        {discordEnabled && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-muted/50 transition-colors"
            onClick={() => handleOAuthSignIn("discord")}
            disabled={isLoading}
            type="button"
          >
            <FaDiscord className="h-4 w-4 text-[#5865F2]" />
            Sign in with Discord
          </Button>
        )}
      </div>
    </>
  );
}
