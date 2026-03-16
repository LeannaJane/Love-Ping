export interface RegisterPayload {
  email: string;
  password: string;
  display_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  display_name: string;
  invite_code: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}