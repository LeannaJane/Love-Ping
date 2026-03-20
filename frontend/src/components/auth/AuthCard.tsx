import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-[2rem] border border-rose-100 bg-pink-50 p-8 shadow-xl shadow-rose-100">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-rose-600">
          {title}
        </h1>
        <p className="text-slate-600">{subtitle}</p>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}