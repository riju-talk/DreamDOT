"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useSession, signIn as nextAuthSignIn, SignInResponse } from "next-auth/react";
import { OAuthButtons } from "../../../components/auth/OAuthButtons";
import { ModeToggle } from "@/components/mode-toggle";

interface FormData {
  email: string;
  password: string;
}

interface SignInError {
  error: string;
}

export default function SignInPage() {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/feed")
    }
  }, [status, router])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } 
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } 
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await nextAuthSignIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      }) as SignInResponse | undefined;

      if (result?.error) {
        toast.error("Sign in failed", {
          description: "Invalid credentials: Check credentials and try again"
        });
        return;
      }

      if (result?.ok) {
        toast.success("Welcome back!", {
          description: "You've successfully signed in to DreamDOT."
        });
        router.push("/feed");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Sign in error", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth feature flags from environment
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true";
  const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === "true";
  const discordEnabled = process.env.NEXT_PUBLIC_DISCORD_OAUTH_ENABLED === "true";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="flex flex-col lg:flex-row items-center justify-center rounded-xl shadow-[var(--shadow-float-lg)] overflow-hidden bg-card border border-border [&_.card]:border-0">
        {/* Left: Illustration */}
        <div className="hidden lg:block">
          <img
            src="https://res.cloudinary.com/diaoy8eua/image/upload/v1750937757/pexels-artem-yellow-422929671-15157857_qqkdym.jpg"
            alt="DreamDOT Illustration"
            className="object-cover h-[600px] w-[600px]"
          />
        </div>

        {/* Right: Sign In Card */}
        <Card className="w-full max-w-md rounded-none lg:rounded-l-none lg:rounded-r-xl shadow-none border-0 bg-transparent">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative overflow-hidden rounded-lg p-1.5 bg-primary">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary">DreamDOT</span>
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue creating
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>
              <div className="space-y-8 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <OAuthButtons 
              isLoading={isLoading}
              googleEnabled={googleEnabled}
              githubEnabled={githubEnabled}
              discordEnabled={discordEnabled}
            />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Don’t have an account?{" "}
              <a
                href="/auth/register"
                className="text-primary hover:underline font-medium"
                tabIndex={isLoading ? -1 : 0}
              >
                Sign up
              </a>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              <a
                href="/feed"
                className="text-foreground/60 hover:text-foreground hover:underline font-medium transition-colors"
              >
                Continue as Guest
              </a>
            </p>            <div className="flex justify-center pt-2 border-t border-border/50 w-full">
              <ModeToggle />
            </div>          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
