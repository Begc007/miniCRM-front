import { ExpiredTasksTable } from "../components/features/reports/ExpiredTasksTable";
import { ExpiredTasksTablePanel } from "../components/features/reports/ExpiredTasksTablePanel";

export const ReportsPage = () => {
  const defaultPagination: PaginationParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: "name",
    sortDirection: "asc",
  };
  const handlePrint = () => {
    console.log("print clicked");
  };
  return (
    <div>
      <ExpiredTasksTablePanel onPrint={handlePrint} />
      <ExpiredTasksTable paginationParams={defaultPagination} />
    </div>
  );
};
