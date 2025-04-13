import { ApiResponse } from "../types/common";
import { PaginationParams } from "../types/pagination";
import { TaskItemResponse } from "../types/task";
import { getQueryString } from "../utils/utils";
import { apiClient } from "./api";

export const taskService = {
  getAll: (
    params?: PaginationParams
  ): Promise<ApiResponse<TaskItemResponse>> => {
    const queryString = getQueryString(params);
    return apiClient<TaskItemResponse>(`TaskItem${queryString}`);
  },
  getTasksByUserId: (
    userId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<TaskItemResponse>> => {
    const queryString = getQueryString(params);
    return apiClient<TaskItemResponse>(`TaskItem/user/${userId}${queryString}`);
  },
};
