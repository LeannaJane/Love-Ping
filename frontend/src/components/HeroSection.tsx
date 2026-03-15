import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
      <div className="space-y-6">
        <span className="inline-flex rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-700">
          Stay close, even on busy days
        </span>

        <div className="space-y-4">
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            A softer way to stay connected with your partner.
          </h1>

          <p className="max-w-lg text-base leading-7 text-slate-600 md:text-lg">
            LovePing helps couples share quick daily check-ins, track their
            emotional connection, and make communication feel simple instead of
            overwhelming.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/register"
            className="rounded-2xl bg-rose-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-rose-200 transition hover:scale-[1.02]"
          >
            Get Started
          </Link>

          <a
            href="#features"
            className="rounded-2xl border border-rose-200 bg-white px-6 py-3 text-center font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            See Demo
          </a>
        </div>

        <div className="flex flex-wrap gap-6 pt-2 text-sm text-slate-500">
          <span>❤️ Built for couples</span>
          <span>🔒 Private by default</span>
          <span>📱 Simple daily habit</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-rose-200/50 blur-2xl" />
        <div className="absolute -right-2 bottom-8 h-32 w-32 rounded-full bg-pink-200/50 blur-2xl" />

        <div className="relative rounded-[2rem] border border-white/70 bg-white p-5 shadow-2xl shadow-rose-100">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-pink-400 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Today’s Ping</p>
                <h2 className="text-2xl font-bold">
                  How connected do you feel?
                </h2>
              </div>

              <div className="rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold">
                7:30 PM
              </div>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  className={`rounded-2xl py-3 text-center font-semibold transition ${
                    score === 4 ? "bg-white text-rose-600" : "bg-white/15"
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-rose-50 p-4">
              <p className="text-sm font-medium text-slate-500">Your streak</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">18 days</p>
              <p className="mt-1 text-sm text-slate-600">
                Small habits, strong connection.
              </p>
            </div>

            <div className="rounded-3xl bg-pink-50 p-4">
              <p className="text-sm font-medium text-slate-500">Shared mood</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                Calm &amp; close
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Based on your last 7 check-ins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}