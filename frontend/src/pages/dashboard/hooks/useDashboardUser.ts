import { useEffect } from "react";
import { getMe } from "../../../services/auth";
import {
  getDashboard,
  type DashboardData,
} from "../../../services/dashboard";
import type { User } from "../../../types/auth";

export function useDashboardUser(
  navigate: (path: string, options?: { replace?: boolean }) => void,
  setUser: (user: User | null) => void,
  setDashboard: (dashboard: DashboardData | null) => void,
  setLoading: (loading: boolean) => void
) {
  useEffect(() => {
    let cancelled = false;

    async function loadUserAndDashboard(): Promise<void> {
      try {
        setLoading(true);

        const [userData, dashboardData] = await Promise.all([
          getMe(),
          getDashboard(),
        ]);

        if (!cancelled) {
          setUser(userData);
          setDashboard(dashboardData);
        }
      } catch (error) {
        console.error("Dashboard error:", error);

        if (!cancelled) {
          setUser(null);
          setDashboard(null);
          navigate("/", { replace: true });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUserAndDashboard();

    return () => {
      cancelled = true;
    };
  }, [navigate, setUser, setDashboard, setLoading]);
}