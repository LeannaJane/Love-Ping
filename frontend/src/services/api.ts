import type { AuthResponse } from "../types/auth";

const API_BASE_URL = "http://127.0.0.1:8000";

function withAuthHeaders(headers?: HeadersInit): Headers {
  const mergedHeaders = new Headers(headers);
  const token = localStorage.getItem("token");

  if (token && !mergedHeaders.has("Authorization")) {
    mergedHeaders.set("Authorization", `Bearer ${token}`);
  }

  return mergedHeaders;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const makeRequest = () =>
    fetch(url, {
      ...options,
      headers: withAuthHeaders(options.headers),
    });

  let response = await makeRequest();

  if (response.status === 401) {
    try {
      await refreshToken();
      response = await makeRequest();
    } catch (error) {
      localStorage.removeItem("token");
      setCookie("refreshToken", "", -1);
      window.location.href = "/login";
      throw error;
    }
  }

  return response;
}

export async function refreshToken(): Promise<AuthResponse> {
  const refreshTokenValue = getCookie("refreshToken");

  if (!refreshTokenValue) {
    throw new Error("Missing refresh token");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshTokenValue,
    }),
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
  let data = null;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
}