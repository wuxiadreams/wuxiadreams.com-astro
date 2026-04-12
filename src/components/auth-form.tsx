import * as React from "react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm({
  isAdmin = false,
  adminEmails = "",
  onSuccess,
}: {
  isAdmin?: boolean;
  adminEmails?: string;
  onSuccess?: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const checkIsAdmin = (checkEmail: string) => {
    if (isAdmin) return true;
    if (adminEmails) {
      const adminList = adminEmails.split(",").map((e) => e.trim());
      return adminList.includes(checkEmail);
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const isUserAdmin = checkIsAdmin(email);
    // Dynamic redirect URL based on whether user is an admin
    const targetURL = isUserAdmin
      ? "/admin/users"
      : window.location.pathname === "/auth/signin"
        ? "/"
        : window.location.pathname;

    try {
      if (isLogin) {
        // Handle Login
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: targetURL,
        });

        if (error) {
          setErrorMsg(error.message || "Invalid email or password.");
        } else {
          if (onSuccess) onSuccess();
          window.location.href = targetURL;
        }
      } else {
        // Handle Signup
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: targetURL,
        });

        if (error) {
          setErrorMsg(error.message || "Failed to create account.");
        } else {
          if (onSuccess) onSuccess();
          window.location.href = targetURL;
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network or server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    setErrorMsg("");
    // We cannot know the email before social login, so we can't accurately check if they are an admin
    // For social login on the auth dialog, we can fallback to isAdmin prop, or we'll just use the current page.
    // Better approach: social login callbackURL handles the initial redirect, but to properly check admin status
    // after a social login, we might need a generic redirect or handle it in the backend.
    // Since Astro middleware handles `/admin/*` checks, we'll try to redirect to `/admin/users` if they *might* be an admin
    // For now, use the same logic:
    const targetURL = isAdmin
      ? "/admin/users"
      : window.location.pathname === "/auth/signin"
        ? "/"
        : window.location.pathname;

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: targetURL,
      });

      if (error) {
        setErrorMsg(error.message || `Failed to sign in with ${provider}`);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network or server error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center sm:text-center mb-6">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-8 rounded-md ring-1 ring-border/50"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {isLogin
            ? "Enter your details to sign in to your account"
            : "Enter your details below to create your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        {!isLogin && (
          <div className="grid gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-none text-foreground/90"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              disabled={isLoading}
              className="h-11 rounded-xl bg-background/50"
            />
          </div>
        )}
        <div className="grid gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none text-foreground/90"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-11 rounded-xl bg-background/50"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none text-foreground/90"
            >
              Password
            </label>
            {isLogin && (
              <a
                href="#"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            )}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-11 rounded-xl bg-background/50"
          />
        </div>

        {errorMsg && (
          <div className="text-[13px] font-medium text-destructive text-center">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          className="mt-2 h-11 rounded-xl font-semibold w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading
            ? "Please wait..."
            : isLogin
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/40" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card/95 px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl bg-background/50 hover:bg-muted"
          disabled={isLoading}
          onClick={() => handleSocialLogin("github")}
        >
          <svg
            className="mr-2 h-4 w-4"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl bg-background/50 hover:bg-muted"
          disabled={isLoading}
          onClick={() => handleSocialLogin("google")}
        >
          <svg
            className="mr-2 h-4 w-4"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          Google
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-2">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMsg("");
          }}
          className="font-semibold text-primary hover:underline focus-visible:outline-none"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
