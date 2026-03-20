import { useEffect } from "react";
import type { User } from "../../../types/auth";

export function useDashboardAutoRefresh(
  user: User | null,
  loadDashboard: () => Promise<void>
) {
  useEffect(() => {
    if (!user) return;
    const intervalId = window.setInterval(() => {
      loadDashboard().catch((error) => {
        console.error("Auto-refresh dashboard error:", error);
      });
    }, 3000);
    const handleFocus = () => {
      loadDashboard().catch((error) => {
        console.error("Focus refresh dashboard error:", error);
      });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadDashboard().catch((error) => {
          console.error("Visibility refresh dashboard error:", error);
        });
      }
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, loadDashboard]);
}
