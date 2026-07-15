import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/95 backdrop-blur p-8 shadow-card">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>
      {children}
    </div>
  );
}

export default AuthCard;