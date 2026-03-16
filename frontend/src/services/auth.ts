import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth";
import { fetchWithRetry, handleResponse, setCookie } from "./api";

const API_BASE_URL = "http://127.0.0.1:8000";

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
  setCookie("refreshToken", data.refresh_token);
  return data;
}

export async function getMe(): Promise<User> {
  const response = await fetchWithRetry(`${API_BASE_URL}/me`);

  return handleResponse(response);
}

export async function logoutUser() {
  localStorage.removeItem("token");
  setCookie("refreshToken", "", -1);
  return { message: "Logged out" };
}