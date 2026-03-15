import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-6 py-12 pb-20 md:py-20">
      <div className="rounded-[2rem] border border-rose-100 bg-white px-8 py-12 text-center shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Start building a better daily connection.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
          Create your account, connect with your partner, and turn check-ins
          into a simple habit you’ll both actually enjoy.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="rounded-2xl bg-rose-500 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-200 transition hover:scale-[1.02]"
          >
            Create Account
          </Link>

          <Link
            to="/login"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
}