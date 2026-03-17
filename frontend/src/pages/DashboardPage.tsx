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

function formatTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-white to-pink-50">
        <div className="rounded-3xl border border-pink-100 bg-white/80 px-8 py-6 shadow-lg backdrop-blur">
          <p className="animate-pulse text-lg font-medium text-pink-500">
            Loading your LovePing space...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-white to-pink-50">
        <div className="rounded-3xl border border-pink-100 bg-white px-8 py-6 text-center shadow-lg">
          <p className="text-xl font-semibold text-rose-500">User not found</p>
          <p className="mt-2 text-sm text-slate-500">
            We couldn’t load your dashboard.
          </p>
        </div>
      </div>
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
              <div className="rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Today’s vibe
                </p>
                <p className="mt-3 text-2xl font-bold text-pink-600">
                  {dashboard.current_mood || "No mood yet"}
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-rose-100 to-pink-50 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Connection streak
                </p>
                <p className="mt-3 text-2xl font-bold text-pink-600">
                  {dashboard.streak} days 🔥
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-fuchsia-100 to-pink-100 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Last ping</p>
                <p className="mt-3 text-2xl font-bold text-pink-600">
                  {dashboard.last_ping || "No pings yet"}
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-100 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Love score</p>
                <p className="mt-3 text-2xl font-bold text-pink-600">
                  {dashboard.love_score}% 💞
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
              Your invite code
            </p>

            <div className="mt-5 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 p-[1px]">
              <div className="rounded-3xl bg-white px-6 py-8 text-center">
                <p className="text-3xl font-extrabold tracking-[0.35em] text-pink-600 sm:text-4xl">
                  {dashboard.invite_code}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  Share this with your partner to connect.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-pink-50 p-4">
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="mt-1 break-all font-semibold text-slate-700">
                {dashboard.email}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-5">
              <p className="text-sm font-medium text-slate-500">Partner</p>

              {dashboard.partner ? (
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-lg font-semibold text-pink-600">
                      {dashboard.partner.display_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {dashboard.partner.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleUnlink}
                    disabled={unlinking}
                    className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {unlinking ? "Unlinking..." : "Unlink partner"}
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <p className="text-sm text-slate-500">
                    Enter your partner’s invite code to connect.
                  </p>

                  <input
                    type="text"
                    value={inviteCodeInput}
                    onChange={(e) =>
                      setInviteCodeInput(e.target.value.toUpperCase())
                    }
                    placeholder="e.g. UF50TBRU"
                    className="w-full rounded-xl border border-pink-200 px-4 py-3 text-slate-800 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />

                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={connecting}
                    className="w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {connecting ? "Connecting..." : "Connect"}
                  </button>
                </div>
              )}

              {connectMessage && (
                <p className="mt-3 text-sm text-green-600">{connectMessage}</p>
              )}

              {connectError && (
                <p className="mt-3 text-sm text-red-500">{connectError}</p>
              )}

              {unlinkMessage && (
                <p className="mt-3 text-sm text-green-600">{unlinkMessage}</p>
              )}

              {unlinkError && (
                <p className="mt-3 text-sm text-red-500">{unlinkError}</p>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Quick Love Pings
                </h2>
                <p className="mt-2 text-slate-500">
                  One tap. One tiny act of affection.
                </p>
              </div>
              <div className="text-3xl">💌</div>
            </div>

            {!isConnected ? (
              <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-slate-500">
                Connect with your partner first to send pings.
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {quickPings.map((ping) => (
                  <button
                    key={ping.value}
                    type="button"
                    onClick={() => handlePingClick(ping)}
                    disabled={sendingPing === ping.value}
                    className="rounded-2xl border border-pink-200 bg-gradient-to-r from-rose-50 to-pink-50 px-5 py-4 text-left font-medium text-pink-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="text-lg">{ping.emoji}</span>
                    <span className="ml-2">{ping.label}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Mood Check-In
                </h2>
                <p className="mt-2 text-slate-500">
                  Let your partner know how your heart feels today.
                </p>
              </div>
              <div className="text-3xl">🥰</div>
            </div>

            {!isConnected ? (
              <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-slate-500">
                Connect with your partner first to share moods.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => handleMoodClick(mood)}
                    disabled={savingMood === mood.value}
                    className="rounded-2xl border border-pink-200 bg-rose-50 px-4 py-4 text-center transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="text-2xl">{mood.emoji}</div>
                    <div className="mt-2 text-sm font-medium">
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-rose-50 p-4">
              <p className="text-sm text-slate-500">Current mood</p>
              <p className="mt-1 font-semibold text-rose-500">
                {dashboard.current_mood || "No mood selected yet"}
              </p>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Recent Love Activity
                </h2>
                <p className="mt-2 text-slate-500">
                  Your little love chat feed.
                </p>
              </div>
              <div className="text-3xl">💬</div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-pink-100 bg-gradient-to-b from-rose-50 via-pink-50 to-white p-4 shadow-inner">
              <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 backdrop-blur">
                <div>
                  <p className="text-sm font-semibold text-pink-600">
                    Love Chat
                  </p>
                  <p className="text-xs text-slate-500">
                    Pings and mood updates in one place
                  </p>
                </div>
                <div className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
                  {dashboard.recent_activity.length} messages
                </div>
              </div>

              <div
                ref={chatRef}
                className="max-h-[420px] overflow-y-auto pr-2"
              >
                {dashboard.recent_activity.length === 0 ? (
                  <div className="flex min-h-[220px] items-center justify-center">
                    <div className="max-w-sm rounded-3xl bg-white px-6 py-5 text-center shadow-sm">
                      <div className="text-3xl">💗</div>
                      <p className="mt-3 font-semibold text-slate-700">
                        No activity yet
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Send a ping or share a mood to start your love chat.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col-reverse space-y-4 space-y-reverse">
                    {dashboard.recent_activity.map((item) => {
                      const isSent = item.is_mine;

                      const bubbleStyles = isSent
                        ? "ml-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                        : item.type === "mood"
                        ? "mr-auto border border-pink-100 bg-white text-slate-700"
                        : "mr-auto bg-rose-100 text-rose-700";

                      const labelStyles = isSent
                        ? "bg-white/20 text-white"
                        : item.type === "mood"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-white/70 text-rose-600";

                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            isSent ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className="max-w-[85%]">
                            <div
                              className={`rounded-[1.5rem] px-4 py-3 shadow-sm ${bubbleStyles}`}
                            >
                              <div className="mb-2 flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${labelStyles}`}
                                >
                                  {item.type}
                                </span>
                              </div>

                              {item.type === "mood" ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">💖</span>
                                  <p className="text-sm font-semibold">
                                    {item.text}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm leading-6">{item.text}</p>
                              )}
                            </div>

                            <p
                              className={`mt-2 text-xs text-slate-400 ${
                                isSent ? "text-right" : "text-left"
                              }`}
                            >
                              {formatTime(item.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800">
              Daily Love Prompt
            </h2>
            <p className="mt-2 text-slate-500">
              A small question to grow your connection.
            </p>

            <div className="mt-6 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 p-6">
              <p className="text-sm font-medium text-slate-500">
                Today’s prompt
              </p>
              <p className="mt-3 text-lg font-semibold text-pink-700">
                {todayPrompt}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}