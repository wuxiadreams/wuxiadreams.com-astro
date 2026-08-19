import { AuthForm } from "@/components/auth-form";

export function LibraryAuthGate() {
  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
      <AuthForm
        subtitle="Sign in to sync your library and reading progress across devices"
        onSuccess={() => {
          window.location.href = "/library";
        }}
      />
    </div>
  );
}
