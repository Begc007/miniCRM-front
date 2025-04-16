import { ApiResponse } from "../types/common";
import { PaginationParams } from "../types/pagination";
import { ExpiredTaskItemResponse } from "../types/task";
import { getQueryString } from "../utils/utils";
import { apiClient } from "./api";

export const reportService = {
  getExpiredTasks: (
    params: PaginationParams
  ): Promise<ApiResponse<ExpiredTaskItemResponse>> => {
    const queryString = getQueryString(params);
    return apiClient<ExpiredTaskItemResponse>(
      `report/expired-tasks${queryString}`
    );
  },
};
