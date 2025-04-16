import { useEffect, useState } from "react";
import { TaskItem } from "../../../types/task";
import { taskService } from "../../../services/taskService";
import { PaginationParams } from "../../../types/pagination";
import { User } from "../../../types/user";
import { formatDate } from "../../../utils/utils";
import { userService } from "../../../services/userService";

interface TaskTableProps {
  userId: number;
  paginationParams?: PaginationParams;
  onPaginationChange?: (newParams: PaginationParams) => void;
  onTaskSelected: (newIds: string[]) => void;
}

export const TaskTable = ({
  userId,
  paginationParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: "name",
    sortDirection: "asc",
  },
  onPaginationChange,
  onTaskSelected,
}: TaskTableProps) => {
  const [user, setUser] = useState<User>();
  const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [localPagination, setLocalPagination] =
    useState<PaginationParams>(paginationParams);

  useEffect(() => {
    setLocalPagination(paginationParams);
  }, [paginationParams]);

  useEffect(() => {
    onTaskSelected(selectedTaskIds);
  }, [selectedTaskIds, onTaskSelected]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await taskService.getTasksByUserId(userId, paginationParams);
      if (resp.success) {
        setTaskList(resp.data); //TODO: resolve this TS bug later
        setTotalItems(resp.pagination.totalCount);
      } else {
        console.error("Error fetching data:", resp.message);
      }
      const resp2 = await userService.getById(userId);
      if (resp2.success) {
        setUser(resp2.data);
      } else {
        console.error("Error fetching data:", resp2.message);
      }
    };
    fetchData();
  }, [userId, localPagination, paginationParams]);

  const handlePageChange = (newPage: number) => {
    const newParams = { ...localPagination, pageNumber: newPage };

    if (onPaginationChange) {
      onPaginationChange(newParams);
    } else {
      setLocalPagination(newParams);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    const newParams = { ...localPagination, pageSize: newSize, pageNumber: 1 };

    if (onPaginationChange) {
      onPaginationChange(newParams);
    } else {
      setLocalPagination(newParams);
    }
  };

  const handleCheckboxChange = (userId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTaskIds((prev) => [...prev, userId]);
    } else {
      setSelectedTaskIds((prev) => prev.filter((id) => id !== userId));
    }
  };
  const totalPages = Math.ceil(totalItems / localPagination.pageSize);

  return (
    <>
      <h1 className="text-xl my-4">
        Задачи: <span className="font-bold">{user?.fio}</span>
      </h1>
      <div className="w-full">
        <form>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">Наименование</th>
                <th className="py-2 px-4 border-b text-left">Дата старта</th>
                <th className="py-2 px-4 border-b text-left">
                  Дата завершения
                </th>
                <th className="py-2 px-4 border-b text-left">
                  Процент выполнения
                </th>
                <th className="py-2 px-4 border-b text-left">Выбрать</th>
              </tr>
            </thead>
            <tbody>
              {taskList &&
                taskList.map((task, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{task.id}</td>
                    <td className="py-2 px-4">{task.name}</td>
                    <td className="py-2 px-4">{formatDate(task.startDate)}</td>
                    <td className="py-2 px-4">{formatDate(task.expiredAt)}</td>
                    <td className="py-2 px-4">{task.percent}%</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`select-user-${index}`}
                          checked={selectedTaskIds.includes(task.id.toString())}
                          onChange={(e) =>
                            handleCheckboxChange(
                              task.id.toString(),
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <label htmlFor={`select-user-${index}`}>Выбрать</label>
                      </div>
                    </td>
                  </tr>
                ))}
              {(!taskList || taskList.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    Нет пользователей с задачами
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </form>
      </div>
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
