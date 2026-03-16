import type { AuthResponse } from "../types/auth";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let response = await fetch(url, options);

  if (response.status === 401) {
    // Avoid circular dependency - import here
    
    try {
      await refreshToken();
      // Retry with new token
      const token = localStorage.getItem("token");
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // If refresh fails, redirect to login
      window.location.href = "/login";
      throw error;
    }
  }

  return response;
}

export async function refreshToken(): Promise<AuthResponse> {
  const refreshToken = getCookie("refreshToken");

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const data = await handleResponse(response);
  localStorage.setItem("token", data.access_token);
  setCookie("refreshToken", data.refresh_token);
  return data;
}

export function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export async function handleResponse(response: Response) {
  console.log("Response status:", response.status);
  console.log("Response ok:", response.ok);
  
  let data;
  try {
    data = await response.json();
    console.log("Parsed JSON:", data);
  } catch (error) {
    console.error("JSON parse error:", error);
    data = null;
  }

  // if 401, refresh and retry once
  if (response.status == 401) {
    refreshToken();
  }

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
}