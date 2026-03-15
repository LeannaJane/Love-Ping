import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth";

const API_BASE_URL = "http://127.0.0.1:8000";

function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => null);

  // if 401, refresh and retry once

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(response);
  localStorage.setItem("token", data.access_token);
  setCookie("refreshToken", data.refresh_token);
  return data;
}

export async function registerUser(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(response);
  localStorage.setItem("token", data.access_token);
  return data;
}

export async function getMe(): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function refreshToken(): Promise<AuthResponse> {
  const refreshToken = getCookie("refreshToken");

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const data = await handleResponse(response);
  localStorage.setItem("token", data.access_token);
  setCookie("refreshToken", data.refresh_token);
  return data;
}

export async function logoutUser() {
  localStorage.removeItem("token");
  setCookie("refreshToken", "", -1);
  return { message: "Logged out" };
}