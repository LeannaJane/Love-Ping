import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import BackLink from "../../components/auth/BackLink";
import AuthLayout from "../../layout/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage(
        "If an account exists for that email, a reset link will be sent."
      );
      setEmail("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="mb-4">
          <BackLink to="/login" label="Back to login" />
        </div>

        <AuthCard
          title="Forgot password"
          subtitle="Enter your email and we’ll help you reset your password."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-2xl bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-rose-600 hover:text-rose-700"
            >
              Go back to login
            </Link>
          </p>
        </AuthCard>
      </div>
    </AuthLayout>
  );
}