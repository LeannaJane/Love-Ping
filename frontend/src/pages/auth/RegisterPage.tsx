import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import BackLink from "../../components/auth/BackLink";
import AuthLayout from "../../layout/AuthLayout";
import { registerUser } from "../../services/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await registerUser({
        display_name: displayName,
        email,
        password,
      });

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage(
        `Welcome ${data.user.display_name}! Your invite code is ${data.user.invite_code}`
      );

      setDisplayName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
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
          title="Create account"
          subtitle="Start your LovePing account."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Display name"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Your name"
              required
            />

            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="your@example.com"
              required
            />

            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-2xl bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-rose-600 hover:text-rose-700"
            >
              Log in
            </Link>
          </p>
        </AuthCard>
      </div>
    </AuthLayout>
  );
}