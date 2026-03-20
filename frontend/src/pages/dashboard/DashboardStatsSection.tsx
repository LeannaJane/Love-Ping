import StatCard from "../../components/ui/Dashboard/StatCard";

import type { DashboardData } from "../../services/dashboard";

interface DashboardStatsSectionProps {
  dashboard: DashboardData;
}

export default function DashboardStatsSection({ dashboard }: DashboardStatsSectionProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Today’s vibe" value={dashboard.current_mood || "No mood yet"} className="bg-gradient-to-br from-pink-100 to-rose-100" />
      <StatCard label="Connection streak" value={`${dashboard.streak} days 🔥`} className="bg-gradient-to-br from-rose-100 to-pink-50" />
      <StatCard label="Last ping" value={dashboard.last_ping || "No pings yet"} className="bg-gradient-to-br from-fuchsia-100 to-pink-100" />
      <StatCard label="Love score" value={`${dashboard.love_score}% 💞`} className="bg-gradient-to-br from-rose-50 to-pink-100" />
    </div>
  );
}
