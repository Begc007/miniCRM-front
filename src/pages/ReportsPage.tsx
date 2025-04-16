import { useNavigate } from "react-router";
import { ExpiredTasksTable } from "../components/features/reports/ExpiredTasksTable";
import { ExpiredTasksTablePanel } from "../components/features/reports/ExpiredTasksTablePanel";
import { PaginationParams } from "../types/pagination";
import { useEffect, useState } from "react";

export const ReportsPage = () => {
  const navigate = useNavigate();
  const defaultPagination: PaginationParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: "name",
    sortDirection: "asc",
  };

  const [paginationParams, setPaginationParams] =
    useState<PaginationParams>(defaultPagination);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const pageNumber = parseInt(queryParams.get("pageNumber") || "1");
    const pageSize = parseInt(queryParams.get("pageSize") || "10");
    const sortBy = queryParams.get("sortBy") || "name";
    const sortDirection =
      (queryParams.get("sortDirection") as "asc" | "desc") || "asc";

    setPaginationParams({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    });
  }, [location.search]);

  const handlePaginationChange = (newParams: PaginationParams) => {
    const queryParams = new URLSearchParams();

    queryParams.set("pageNumber", newParams.pageNumber.toString());
    queryParams.set("pageSize", newParams.pageSize.toString());
    queryParams.set("sortBy", newParams.sortBy);
    queryParams.set("sortDirection", newParams.sortDirection);

    navigate(`/reports/expired-tasks?${queryParams.toString()}`, {
      replace: true,
    });
  };

  const handlePrint = () => {
    window.print();
  };
  return (
    <div>
      <ExpiredTasksTablePanel onPrint={handlePrint} />
      <ExpiredTasksTable
        paginationParams={paginationParams}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
};
