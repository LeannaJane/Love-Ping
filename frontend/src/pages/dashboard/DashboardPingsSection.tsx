import PingButton from "../../components/ui/Actions/PingButton";
import DashboardCard from "../../components/ui/Dashboard/DashboardCard";
import EmptyState from "../../components/ui/Feedback/EmptyState";
import SectionHeader from "../../components/ui/Info/SectionHeader";
import { quickPings } from "./dashboard.constants";

interface DashboardPingsSectionProps {
  isConnected: boolean;
  sendingPing: string | null;
  handlePingClick: (ping: { emoji: string; label: string; value: string }) => void;
}

export default function DashboardPingsSection({ isConnected, sendingPing, handlePingClick }: DashboardPingsSectionProps) {
  return (
    <DashboardCard>
      <SectionHeader title="Quick Love Pings" subtitle="One tap. One tiny act of affection." icon="💌" />
      {!isConnected ? (
        <div className="mt-6">
          <EmptyState text="Connect with your partner first to send pings." />
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {quickPings.map((ping) => (
            <PingButton
              key={ping.value}
              emoji={ping.emoji}
              label={ping.label}
              disabled={sendingPing === ping.value}
              onClick={() => handlePingClick(ping)}
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
