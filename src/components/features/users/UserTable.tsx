import { useEffect, useState } from "react";
import { PaginationParams } from "../../../types/pagination";
import { userService } from "../../../services/userService";
import { TasksGroupedByUserResponse } from "../../../types/user";

interface UserTableProps {
  paginationParams?: PaginationParams;
  onPaginationChange?: (newParams: PaginationParams) => void;
  onUserSelected: (newIds: string[]) => void;
  fio: string | null;
}

export const UserTable = ({
  paginationParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: "name",
    sortDirection: "asc",
  },
  onPaginationChange,
  onUserSelected,
  fio,
}: UserTableProps) => {
  const [tasksByUser, setTasksByUser] = useState<
    TasksGroupedByUserResponse[] | undefined
  >([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [localPagination, setLocalPagination] =
    useState<PaginationParams>(paginationParams);

  useEffect(() => {
    setLocalPagination(paginationParams);
  }, [paginationParams]);

  useEffect(() => {
    onUserSelected(selectedUserIds);
  }, [selectedUserIds, onUserSelected]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await userService.getTasksGroupedByUser(
        fio,
        localPagination
      );
      if (!resp.success) {
        console.error(`${resp.errorCode} ${resp.message}`); //TODO: make this error message. Create common component of error
      }
      setTasksByUser(resp.data);
      if (resp.pagination?.totalCount) {
        setTotalItems(resp.pagination.totalCount);
      }
    };
    fetchData();
  }, [localPagination, fio]);

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

  const handleCheckboxChange = (userId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedUserIds((prev) => [...prev, userId]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const totalPages = Math.ceil(totalItems / localPagination.pageSize);

  return (
    <>
      <div className="w-full">
        <form>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">
                  Имя пользователя
                </th>
                <th className="py-2 px-4 border-b text-left">ФИО</th>
                <th className="py-2 px-4 border-b text-left">
                  Должность{" "}
                  {localPagination.sortBy === "position"
                    ? localPagination.sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th className="py-2 px-4 border-b text-left">
                  Задач{" "}
                  {localPagination.sortBy === "taskItemCount"
                    ? localPagination.sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th className="py-2 px-4 border-b text-left">
                  Выполнено{" "}
                  {localPagination.sortBy === "completedPercent"
                    ? localPagination.sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th className="py-2 px-4 border-b text-left">Выбрать</th>
              </tr>
            </thead>
            <tbody>
              {tasksByUser &&
                tasksByUser.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.userId}</td>
                    <td className="py-2 px-4">{user.userName}</td>
                    <td className="py-2 px-4">{user.fio}</td>
                    <td className="py-2 px-4">{user.position}</td>
                    <td className="py-2 px-4">{user.taskItemCount}</td>
                    <td className="py-2 px-4">{user.completedPercent}%</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`select-user-${index}`}
                          checked={selectedUserIds.includes(
                            user.userId.toString()
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(
                              user.userId.toString(),
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
              {(!tasksByUser || tasksByUser.length === 0) && (
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
