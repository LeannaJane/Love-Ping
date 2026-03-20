import DashboardCard from "../../components/ui/Dashboard/DashboardCard";
import SectionHeader from "../../components/ui/Info/SectionHeader";
import ChatHeader from "../../components/ui/Chat/ChatHeader";
import ChatBubble from "../../components/ui/Chat/ChatBubble";
import EmptyState from "../../components/ui/Feedback/EmptyState";
import type { DashboardData } from "../../services/dashboard";
import { useRef } from "react";

interface DashboardActivitySectionProps {
  recentActivity: DashboardData["recent_activity"];
}

export default function DashboardActivitySection({ recentActivity }: DashboardActivitySectionProps) {
  const chatRef = useRef<HTMLDivElement | null>(null);
  return (
    <DashboardCard className="lg:col-span-2">
      <SectionHeader
        title="Recent Love Activity"
        subtitle="Your little love chat feed."
        icon="💬"
      />
      <div className="mt-6 rounded-[1.75rem] border border-pink-100 bg-gradient-to-b from-rose-50 via-pink-50 to-white p-4 shadow-inner">
        <ChatHeader count={recentActivity.length} />
        <div ref={chatRef} className="max-h-[420px] overflow-y-auto pr-2">
          {recentActivity.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="max-w-sm">
                <EmptyState
                  icon="💗"
                  title="No activity yet"
                  text="Send a ping or share a mood to start your love chat."
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse space-y-4 space-y-reverse">
              {recentActivity.map((item) => (
                <ChatBubble
                  key={item.id}
                  type={item.type as "ping" | "mood"}
                  text={item.text}
                  createdAt={item.created_at}
                  isMine={item.is_mine}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
