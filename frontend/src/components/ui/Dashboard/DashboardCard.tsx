import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export default function DashboardCard({
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <section
      className={`rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl ${className}`}
    >
      {children}
    </section>
  );
}