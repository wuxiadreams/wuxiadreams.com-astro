import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "./auth-form";

export function AuthDialog({
  triggerText = "Sign in",
  triggerClassName = "hidden min-w-20 h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:inline-flex cursor-pointer",
  isAdmin = false,
}: {
  triggerText?: string;
  triggerClassName?: string;
  isAdmin?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className={triggerClassName}>{triggerText}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl p-6">
        <AuthForm isAdmin={isAdmin} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
