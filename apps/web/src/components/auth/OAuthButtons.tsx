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
        <span className="h-px flex-1 bg-[#101611]/10 dark:bg-[#f5f2e8]/10" />
        <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#63725f] dark:text-[#8fa088]">
          {modeLabel}
        </span>
        <span className="h-px flex-1 bg-[#101611]/10 dark:bg-[#f5f2e8]/10" />
      </div>

      <div className="flex flex-col space-y-2">
        {googleEnabled && (
          <Button
            variant="outline"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border-[#101611]/12 bg-white/72 text-[#101611] transition-colors hover:bg-[#101611]/5 dark:border-[#f5f2e8]/12 dark:bg-[#060907]/65 dark:text-[#f5f2e8] dark:hover:bg-[#f5f2e8]/10 dark:hover:text-white"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <FaGoogle className="size-4 text-red-400" />}
            Google
          </Button>
        )}
        
        {githubEnabled && (
          <Button
            variant="outline"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border-[#101611]/12 bg-white/72 text-[#101611] transition-colors hover:bg-[#101611]/5 dark:border-[#f5f2e8]/12 dark:bg-[#060907]/65 dark:text-[#f5f2e8] dark:hover:bg-[#f5f2e8]/10 dark:hover:text-white"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <FaGithub className="size-4" />}
            GitHub
          </Button>
        )}

        {discordEnabled && (
          <Button
            variant="outline"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border-[#101611]/12 bg-white/72 text-[#101611] transition-colors hover:bg-[#101611]/5 dark:border-[#f5f2e8]/12 dark:bg-[#060907]/65 dark:text-[#f5f2e8] dark:hover:bg-[#f5f2e8]/10 dark:hover:text-white"
            onClick={() => handleOAuthSignIn("discord")}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <FaDiscord className="size-4 text-[#8ea1ff]" />}
            Discord
          </Button>
        )}
      </div>
    </>
  );
}
