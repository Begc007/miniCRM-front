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

export const formatDate = (date: Date | string | null) => {
  if (!date) {
    return "";
  }

  if (typeof date === "string") {
    if (date === "0001-01-01T00:00:00") {
      return "";
    }
    try {
      date = new Date(date);
    } catch (e) {
      return "";
    }
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const formattedDate = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  return formattedDate;
};
