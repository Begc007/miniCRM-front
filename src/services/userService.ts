import { ApiResponse } from "../types/common";
import { PaginationParams } from "../types/pagination";
import { TasksGroupedByUserResponse, UserResponse } from "../types/user";
import { getQueryString } from "../utils/utils";
import { apiClient } from "./api";

export const userService = {
  getAll: (params?: PaginationParams): Promise<ApiResponse<UserResponse>> => {
    const queryString = getQueryString(params);
    return apiClient<UserResponse>(`user${queryString}`);
  },
  getTasksGroupedByUser: (
    params?: PaginationParams
  ): Promise<ApiResponse<TasksGroupedByUserResponse[]>> => {
    const queryString = getQueryString(params);
    return apiClient<TasksGroupedByUserResponse[]>(`user${queryString}`);
  },
};
