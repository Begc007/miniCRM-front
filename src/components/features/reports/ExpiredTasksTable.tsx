import { useEffect, useState } from "react";
import { PaginationParams } from "../../../types/pagination";
import { ExpiredTaskItem } from "../../../types/task";
import { reportService } from "../../../services/reportService";
import { formatDate } from "../../../utils/utils";

export interface ExpiredTasksProps {
  paginationParams: PaginationParams;
  onPaginationChange?: (newParams: PaginationParams) => void;
}

export const ExpiredTasksTable = ({
  paginationParams,
  onPaginationChange,
}: ExpiredTasksProps) => {
  const [data, setData] = useState<ExpiredTaskItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0); //TODO: pagination must be separate component
  const [localPagination, setLocalPagination] =
    useState<PaginationParams>(paginationParams);

  useEffect(() => {
    setLocalPagination(paginationParams);
  }, [paginationParams]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await reportService.getExpiredTasks(paginationParams);
      if (resp.success) {
        setData(resp.data);
      } else {
        console.error("Failed fetching report", resp.message);
      }
    };
    fetchData();
  }, [localPagination]);

  const handlePageChange = (newPage: number) => {
    const newParams = { ...localPagination, pageNumber: newPage };

    if (onPaginationChange) {
      onPaginationChange(newParams);
    } else {
      setLocalPagination(newParams);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    const newParams = { ...localPagination, pageSize: newSize, pageNumber: 1 }; // Reset to page 1

    if (onPaginationChange) {
      onPaginationChange(newParams);
    } else {
      setLocalPagination(newParams);
    }
  };

  const totalPages = Math.ceil(totalItems / localPagination.pageSize);

  return (
    <>
      <div className="w-full">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">#</th>
              <th className="py-2 px-4 border-b text-left">Сотрудник</th>
              <th className="py-2 px-4 border-b text-left">Наименование</th>
              <th className="py-2 px-4 border-b text-left">Дата старта</th>
              <th className="py-2 px-4 border-b text-left">
                Дата фактического завершения
              </th>
              <th className="py-2 px-4 border-b text-left">
                Дата завершения (deadline)
              </th>
              <th className="py-2 px-4 border-b text-left">% выполнения</th>
              <th className="py-2 px-4 border-b text-left">Просрочено дней</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((task, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{task.id}</td>
                  <td className="py-2 px-4">{task.user.fio}</td>
                  <td className="py-2 px-4">{task.name}</td>
                  <td className="py-2 px-4">{formatDate(task.startDate)}</td>
                  <td className="py-2 px-4">{formatDate(task.completedAt)}</td>
                  <td className="py-2 px-4">{formatDate(task.expiredAt)}</td>
                  <td className="py-2 px-4">{task.percent}%</td>
                  <td className="py-2 px-4">{task.expiredDays}</td>
                </tr>
              ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  Нет просроченных задач
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/*TODO: pagination component must be separate*/}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <select
            value={localPagination.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={2}>2 строк</option>
            <option value={10}>10 строк</option>
            <option value={25}>25 строк</option>
            <option value={50}>50 строк</option>
          </select>
        </div>
        <div className="flex">
          <button
            onClick={() =>
              handlePageChange(Math.max(1, localPagination.pageNumber - 1))
            }
            disabled={localPagination.pageNumber <= 1}
            className="px-3 py-1 border rounded mx-1"
          >
            Назад
          </button>

          <span className="px-3 py-1">
            Страница {localPagination.pageNumber} из {totalPages}
          </span>

          <button
            onClick={() =>
              handlePageChange(
                Math.min(totalPages, localPagination.pageNumber + 1)
              )
            }
            disabled={localPagination.pageNumber >= totalPages}
            className="px-3 py-1 border rounded mx-1"
          >
            Вперед
          </button>
        </div>
      </div>
    </>
  );
};
