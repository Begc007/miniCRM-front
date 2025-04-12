import { PaginationMetadata } from "./pagination";

export interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  errorCode?: string | null;
  data?: T;
  pagination?: PaginationMetadata;
}

export interface ApiError {
  success: boolean;
  errorCode: string;
  message: string;
}
