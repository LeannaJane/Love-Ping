import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/auth";
import { getDashboard, saveMood, sendPing, type DashboardData } from "../services/dashboard";

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
  return date.toLocaleString();
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingPing, setSendingPing] = useState<string | null>(null);
  const [savingMood, setSavingMood] = useState<string | null>(null);

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
              Your cozy little corner for affection, check-ins, and sweet daily connection.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Today’s vibe</p>
                <p className="mt-3 text-2xl font-bold text-pink-600">
                  {dashboard.current_mood || "No mood yet"}
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-rose-100 to-pink-50 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Connection streak</p>
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
              <p className="mt-2 text-lg font-semibold text-pink-600">
                {dashboard.partner ? dashboard.partner.display_name : "Not connected yet"}
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Quick Love Pings</h2>
                <p className="mt-2 text-slate-500">One tap. One tiny act of affection.</p>
              </div>
              <div className="text-3xl">💌</div>
            </div>

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
          </section>

          <section className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Mood Check-In</h2>
                <p className="mt-2 text-slate-500">
                  Let your partner know how your heart feels today.
                </p>
              </div>
              <div className="text-3xl">🥰</div>
            </div>

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
                  <div className="mt-2 text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>

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
                <h2 className="text-2xl font-bold text-slate-800">Recent Love Activity</h2>
                <p className="mt-2 text-slate-500">
                  A tiny relationship timeline for your daily connection.
                </p>
              </div>
              <div className="text-3xl">🕰️</div>
            </div>

            <div className="mt-6 space-y-4">
              {dashboard.recent_activity.length === 0 ? (
                <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-4 text-slate-500">
                  No activity yet.
                </div>
              ) : (
                dashboard.recent_activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-700">{item.text}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatTime(item.created_at)}
                      </p>
                    </div>

                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-pink-500 shadow-sm">
                      {item.type}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800">Daily Love Prompt</h2>
            <p className="mt-2 text-slate-500">A small question to grow your connection.</p>

            <div className="mt-6 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 p-6">
              <p className="text-sm font-medium text-slate-500">Today’s prompt</p>
              <p className="mt-3 text-lg font-semibold text-pink-700">{todayPrompt}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}