import { Link } from "react-router-dom";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight text-rose-600">
          LovePing
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#features" className="transition hover:text-rose-600">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-rose-600">
            How it works
          </a>
          <a href="#cta" className="transition hover:text-rose-600">
            Get started
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-rose-50"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02]"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}