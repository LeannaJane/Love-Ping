import { useEffect, type RefObject } from "react";
import type { DashboardData } from "../../../services/dashboard";

export function useDashboardChatScroll(
  chatRef: RefObject<HTMLDivElement | null>,
  dashboard: DashboardData | null
) {
  useEffect(() => {
    if (!chatRef.current || !dashboard?.recent_activity?.length) {
      return;
    }

    chatRef.current.scrollTop = 0;
  }, [chatRef, dashboard?.recent_activity]);
}