import { fetchWithRetry, handleResponse } from "./api";

const API_URL = "http://127.0.0.1:8000";

export interface Partner {
  id: number;
  display_name: string;
  email: string;
}

export interface FeedItem {
  id: number;
  type: "ping" | "mood";
  text: string;
  created_at: string;
  is_mine: boolean;
}

export interface DashboardData {
  user_id: number;
  display_name: string;
  email: string;
  invite_code: string;
  partner: Partner | null;
  current_mood: string | null;
  last_ping: string | null;
  streak: number;
  love_score: number;
  recent_activity: FeedItem[];
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await fetchWithRetry(`${API_URL}/dashboard`);
  return handleResponse(response);
}

export async function connectWithInviteCode(invite_code: string) {
  const response = await fetchWithRetry(`${API_URL}/connections/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invite_code,
    }),
  });

  return handleResponse(response);
}

export async function unlinkPartner() {
  const response = await fetchWithRetry(`${API_URL}/connections/unlink`, {
    method: "DELETE",
  });

  return handleResponse(response);
}

export async function sendPing(pingType: string) {
  const response = await fetchWithRetry(`${API_URL}/dashboard/pings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ping_type: pingType,
    }),
  });

  return handleResponse(response);
}

export async function saveMood(mood: string) {
  const response = await fetchWithRetry(`${API_URL}/dashboard/moods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mood,
    }),
  });

  return handleResponse(response);
}