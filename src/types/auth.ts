export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fio: string;
  position: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: number;
  username: string;
  fio: string;
}
