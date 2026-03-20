import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  connectWithInviteCode,
  getDashboard,
  saveMood,
  sendPing,
  unlinkPartner,
  type DashboardData,
} from "../services/dashboard";
import PartnerConnectionPanel from "../components/dashboard/PartnerConnectionPanel";
import DashboardPingsSection from "./dashboard/DashboardPingsSection";
import DashboardMoodSection from "./dashboard/DashboardMoodSection";
import DashboardActivitySection from "./dashboard/DashboardActivitySection";
import DashboardPromptSection from "./dashboard/DashboardPromptSection";
import FullScreenMessage from "../components/ui/Feedback/FullScreenMessage";
import type { User } from "../types/auth";
import { moods, quickPings } from "./dashboard/dashboard.constants";
import { useDashboardUser } from "./dashboard/hooks/useDashboardUser";
import { useDashboardAutoRefresh } from "./dashboard/hooks/useDashboardAutoRefresh";
import { useDashboardChatScroll } from "./dashboard/hooks/useDashboardChatScroll";
import StatCard from "../components/ui/Dashboard/StatCard";


export default function DashboardPage() {
  const navigate = useNavigate();
  const chatRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [sendingPing, setSendingPing] = useState<string | null>(null);
  const [savingMood, setSavingMood] = useState<string | null>(null);

  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [connectMessage, setConnectMessage] = useState("");

  const [unlinking, setUnlinking] = useState(false);
  const [unlinkError, setUnlinkError] = useState("");
  const [unlinkMessage, setUnlinkMessage] = useState("");

  const todayPrompt = useMemo(() => {
    const prompts = [
      "What made you smile about your partner this week?",
      "What is one tiny thing they do that you secretly love?",
      "What would make you feel extra loved today?",
      "What memory with your partner always makes you laugh?",
    ];

    const dayIndex = new Date().getDate() % prompts.length;
    return prompts[dayIndex];
  }, []);

  const loadDashboard = useCallback(async (): Promise<void> => {
    const data = await getDashboard();
    setDashboard(data);
  }, []);

  useDashboardUser(navigate, setUser, setDashboard, setLoading);
  useDashboardAutoRefresh(user, loadDashboard);
  useDashboardChatScroll(chatRef, dashboard);

  async function handleConnect() {
    const cleanedCode = inviteCodeInput.trim().toUpperCase();

    if (!cleanedCode) {
      setConnectError("Please enter an invite code.");
      setConnectMessage("");
      return;
    }

    try {
      setConnecting(true);
      setConnectError("");
      setConnectMessage("");
      setUnlinkError("");
      setUnlinkMessage("");

      await connectWithInviteCode(cleanedCode);

      setInviteCodeInput("");
      setConnectMessage("Connected successfully 💖");

      await loadDashboard();
    } catch (err) {
      console.error("Connect error:", err);
      setConnectError(
        err instanceof Error ? err.message : "Failed to connect"
      );
      setConnectMessage("");
    } finally {
      setConnecting(false);
    }
  }

  async function handleUnlink() {
    const confirmed = window.confirm(
      "Are you sure you want to unlink from your current partner?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUnlinking(true);
      setUnlinkError("");
      setUnlinkMessage("");
      setConnectError("");
      setConnectMessage("");

      await unlinkPartner();
      setUnlinkMessage("Partner unlinked successfully.");

      await loadDashboard();
    } catch (err) {
      console.error("Unlink error:", err);
      setUnlinkError(
        err instanceof Error ? err.message : "Failed to unlink partner"
      );
    } finally {
      setUnlinking(false);
    }
  }

  async function handlePingClick(ping: (typeof quickPings)[number]) {
    try {
      setSendingPing(ping.value);
      await sendPing(ping.value);
      await loadDashboard();
    } catch (error) {
      console.error("Ping error:", error);
    } finally {
      setSendingPing(null);
    }
  }

  async function handleMoodClick(mood: (typeof moods)[number]) {
    try {
      setSavingMood(mood.value);
      await saveMood(mood.value);
      await loadDashboard();
    } catch (error) {
      console.error("Mood error:", error);
    } finally {
      setSavingMood(null);
    }
  }

  if (loading) {
    return <FullScreenMessage title="Loading your LovePing space..." animated />;
  }

  if (!user || !dashboard) {
    return (
      <FullScreenMessage
        title="We couldn’t load your dashboard"
        subtitle="Please sign in again."
      />
    );
  }

  const isConnected = Boolean(dashboard.partner);

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-3">
          <section className="xl:col-span-2 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-600">
              <span>💖</span>
              <span>LovePing Dashboard</span>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-pink-600 md:text-5xl">
              Welcome back, {dashboard.display_name}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Your cozy little corner for affection, check-ins, and sweet daily
              connection.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Today’s vibe"
                value={dashboard.current_mood || "No mood yet"}
                className="bg-gradient-to-br from-pink-100 to-rose-100"
              />

              <StatCard
                label="Connection streak"
                value={`${dashboard.streak} days 🔥`}
                className="bg-gradient-to-br from-rose-100 to-pink-50"
              />

              <StatCard
                label="Last ping"
                value={dashboard.last_ping || "No pings yet"}
                className="bg-gradient-to-br from-fuchsia-100 to-pink-100"
              />

              <StatCard
                label="Love score"
                value={`${dashboard.love_score}% 💞`}
                className="bg-gradient-to-br from-rose-50 to-pink-100"
              />
            </div>
          </section>

          <PartnerConnectionPanel
            dashboard={dashboard}
            inviteCodeInput={inviteCodeInput}
            connecting={connecting}
            connectError={connectError}
            connectMessage={connectMessage}
            unlinking={unlinking}
            unlinkError={unlinkError}
            unlinkMessage={unlinkMessage}
            onInviteCodeChange={setInviteCodeInput}
            onConnect={handleConnect}
            onUnlink={handleUnlink}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DashboardPingsSection
            isConnected={isConnected}
            sendingPing={sendingPing}
            handlePingClick={handlePingClick}
          />

          <DashboardMoodSection
            isConnected={isConnected}
            moods={moods}
            savingMood={savingMood}
            handleMoodClick={handleMoodClick}
            currentMood={dashboard.current_mood}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <DashboardActivitySection recentActivity={dashboard.recent_activity} />
          <DashboardPromptSection todayPrompt={todayPrompt} />
        </div>
      </div>
    </main>
  );
}