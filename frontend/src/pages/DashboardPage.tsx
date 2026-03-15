import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/auth";

interface User {
  id: number;
  email: string;
  display_name: string;
  invite_code: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getMe();
        setUser(data);
      } catch (error) {
        console.error("Dashboard error:", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-purple-200 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        <h1 className="text-4xl font-bold text-pink-600">
          Welcome {user.display_name} 💖
        </h1>
        <p className="mt-3 text-gray-600">Your LovePing dashboard</p>
        <div className="mt-8 bg-pink-50 rounded-xl p-6">
          <p className="text-sm text-gray-500">Your Invite Code</p>
          <p className="text-3xl font-bold tracking-widest text-pink-600">
            {user.invite_code}
          </p>
        </div>
      </div>
    </main>
  );
}