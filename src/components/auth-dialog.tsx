"use client";

import * as React from "react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AuthDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/admin/users",
        });

        if (error) {
          setErrorMsg(error.message || "Invalid email or password.");
        } else {
          setIsOpen(false);
          window.location.href = "/admin/users";
        }
      } else {
        // Handle Signup
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/admin/users",
        });

        if (error) {
          setErrorMsg(error.message || "Failed to create account.");
        } else {
          setIsOpen(false);
          window.location.href = "/admin/users";
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network or server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="hidden min-w-20 h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:inline-flex">
          Sign in
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-8 rounded-md ring-1 ring-border/50"
            />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {isLogin ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5">
            {isLogin
              ? "Enter your details to sign in to your account"
              : "Enter your details below to create your account"}
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
