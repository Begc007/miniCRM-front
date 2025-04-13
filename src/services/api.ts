import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types/common";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7138/api/v1/";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// The API client
export const apiClient = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      ...options,
    });

    if (response.status === 204) {
      return {
        success: true,
        message: "Operation completed successfully",
      } as ApiResponse<T>;
    }

    return response.data as ApiResponse<T>;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiResponse = error.response.data as Partial<ApiResponse<T>>;

      return {
        success: false,
        errorCode:
          apiResponse.errorCode || `HTTP_ERROR_${error.response.status}`,
        message:
          apiResponse.message ||
          error.message ||
          `HTTP error ${error.response.status}`,
      } as ApiResponse<T>;
    }

    return {
      success: false,
      errorCode: "NETWORK_ERROR",
      message:
        error instanceof Error ? error.message : "A network error occurred",
    } as ApiResponse<T>;
  }
};

export const get = <T>(endpoint: string, params?: object) =>
  apiClient<T>(endpoint, { method: "GET", params });

export const post = <T>(endpoint: string, data?: any) =>
  apiClient<T>(endpoint, { method: "POST", data });

export const put = <T>(endpoint: string, data?: any) =>
  apiClient<T>(endpoint, { method: "PUT", data });

export const del = <T>(endpoint: string) =>
  apiClient<T>(endpoint, { method: "DELETE" });

export default axiosInstance;
