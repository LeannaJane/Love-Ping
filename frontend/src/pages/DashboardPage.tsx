import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/auth";
import {
  connectWithInviteCode,
  getDashboard,
  saveMood,
  sendPing,
  unlinkPartner,
  type DashboardData,
} from "../services/dashboard";
import PartnerConnectionPanel from "../components/dashboard/PartnerConnectionPanel";
import MoodButton from "../components/ui/Actions/MoodButton";
import PingButton from "../components/ui/Actions/PingButton";
import PromptCard from "../components/ui/Actions/PromptCard";
import ChatBubble from "../components/ui/Chat/ChatBubble";
import ChatHeader from "../components/ui/Chat/ChatHeader";
import DashboardCard from "../components/ui/Dashboard/DashboardCard";
import StatCard from "../components/ui/Dashboard/StatCard";
import EmptyState from "../components/ui/Feedback/EmptyState";
import FullScreenMessage from "../components/ui/Feedback/FullScreenMessage";
import InfoBlock from "../components/ui/Info/InfoBlock";
import SectionHeader from "../components/ui/Info/SectionHeader";


interface User {
  id: number;
  email: string;
  display_name: string;
  invite_code: string;
}

const quickPings = [
  { emoji: "🤗", label: "Hug me", value: "hug_me" },
  { emoji: "😘", label: "Kiss me", value: "kiss_me" },
  { emoji: "🥺", label: "I miss you", value: "miss_you" },
  { emoji: "💌", label: "Thinking of you", value: "thinking_of_you" },
  { emoji: "🔥", label: "Date tonight?", value: "date_tonight" },
  { emoji: "🌙", label: "Goodnight", value: "goodnight" },
];

const moods = [
  { emoji: "😊", label: "Happy", value: "Happy 😊" },
  { emoji: "🥰", label: "Loving", value: "Loving 🥰" },
  { emoji: "😌", label: "Calm", value: "Calm 😌" },
  { emoji: "🥺", label: "Clingy", value: "Clingy 🥺" },
  { emoji: "😴", label: "Tired", value: "Tired 😴" },
  { emoji: "😔", label: "Sad", value: "Sad 😔" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const chatRef = useRef<HTMLDivElement | null>(null);

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

  async function loadDashboard() {
    const data = await getDashboard();
    setDashboard(data);
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getMe();
        setUser(data);
        await loadDashboard();
      } catch (error) {
        console.error("Dashboard error:", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const intervalId = window.setInterval(() => {
      loadDashboard().catch((error) => {
        console.error("Auto-refresh dashboard error:", error);
      });
    }, 3000);

    const handleFocus = () => {
      loadDashboard().catch((error) => {
        console.error("Focus refresh dashboard error:", error);
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadDashboard().catch((error) => {
          console.error("Visibility refresh dashboard error:", error);
        });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  useEffect(() => {
    if (!chatRef.current || !dashboard?.recent_activity?.length) {
      return;
    }

    chatRef.current.scrollTop = 0;
  }, [dashboard?.recent_activity]);

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
        title="User not found"
        subtitle="We couldn’t load your dashboard."
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
          <DashboardCard>
            <SectionHeader
              title="Quick Love Pings"
              subtitle="One tap. One tiny act of affection."
              icon="💌"
            />

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

          <DashboardCard>
            <SectionHeader
              title="Mood Check-In"
              subtitle="Let your partner know how your heart feels today."
              icon="🥰"
            />

            {!isConnected ? (
              <div className="mt-6">
                <EmptyState text="Connect with your partner first to share moods." />
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {moods.map((mood) => (
                  <MoodButton
                    key={mood.value}
                    emoji={mood.emoji}
                    label={mood.label}
                    disabled={savingMood === mood.value}
                    onClick={() => handleMoodClick(mood)}
                  />
                ))}
              </div>
            )}

            <InfoBlock
              label="Current mood"
              value={dashboard.current_mood || "No mood selected yet"}
              className="mt-5 bg-rose-50"
              valueClassName="text-rose-500"
            />
          </DashboardCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <DashboardCard className="lg:col-span-2">
            <SectionHeader
              title="Recent Love Activity"
              subtitle="Your little love chat feed."
              icon="💬"
            />

            <div className="mt-6 rounded-[1.75rem] border border-pink-100 bg-gradient-to-b from-rose-50 via-pink-50 to-white p-4 shadow-inner">
              <ChatHeader count={dashboard.recent_activity.length} />

              <div ref={chatRef} className="max-h-[420px] overflow-y-auto pr-2">
                {dashboard.recent_activity.length === 0 ? (
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
                    {dashboard.recent_activity.map((item) => (
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

          <DashboardCard>
            <h2 className="text-2xl font-bold text-slate-800">
              Daily Love Prompt
            </h2>
            <p className="mt-2 text-slate-500">
              A small question to grow your connection.
            </p>

            <PromptCard label="Today’s prompt" prompt={todayPrompt} />
          </DashboardCard>
        </div>
      </div>
    </main>
  );
}