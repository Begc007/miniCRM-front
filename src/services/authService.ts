import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import { ApiResponse } from "../types/common";
import { post } from "./api";

const TOKEN_KEY = "auth_token";
const USER_INFO_KEY = "user_info";

export const authService = {
  login: (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return post<AuthResponse>("user/login", credentials).then((resp) => {
      if (resp.token) {
        localStorage.setItem(TOKEN_KEY, resp.token);
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(resp.token));
      }
      return resp;
    });
  },

  register: (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return post<AuthResponse>("user/register", userData).then((resp) => {
      if (resp.token) {
        localStorage.setItem(TOKEN_KEY, resp.token);
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(resp.token));
      }
      return resp;
    });
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    window.location.href = "/login";
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUserInfo: (): AuthResponse | null => {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    if (userInfo) {
      return JSON.parse(userInfo) as AuthResponse;
    }
    return null;
  },
};
