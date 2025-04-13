import { PaginationParams } from "../types/pagination";

export function getQueryString(params?: PaginationParams) {
  if (!params) return "";

  const queryParams = new URLSearchParams();

  if (params.pageNumber) {
    queryParams.append("PageNumber", params.pageNumber.toString());
  }
  if (params.pageSize) {
    queryParams.append("PageSize", params.pageSize.toString());
  }
  if (params.sortBy) {
    queryParams.append("SortBy", params.sortBy);
  }
  if (params.sortDirection) {
    queryParams.append("SortDirection", params.sortDirection);
  }

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  return queryString;
}
