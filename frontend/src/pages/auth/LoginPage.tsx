import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import BackLink from "../../components/auth/BackLink";
import AuthLayout from "../../layout/AuthLayout";
import { loginUser } from "../../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser({ email, password });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="mb-4">
          <BackLink to="/" label="Back to home" />
        </div>

        <AuthCard
          title="Welcome back"
          subtitle="Log in to your LovePing account."
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
            />

            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 text-center text-sm text-slate-600 space-y-2">
            <p>
              Forgot your password?{" "}
              <Link
                to="/forgot-password"
                className="font-semibold text-rose-600 hover:text-rose-700"
              >
                Reset it
              </Link>
            </p>

            <p>
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-rose-600 hover:text-rose-700"
              >
                Register
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>
  );
}