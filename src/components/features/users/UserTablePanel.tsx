import React, { useState } from "react";

interface UserTablePanelProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTasks?: () => void;
  onReport?: () => void;
  onSearch?: (query: string) => void;
  EditDisabled: boolean;
  DeleteDisabled: boolean;
  TasksDisabled: boolean;
}

export const UserTablePanel = ({
  onAdd,
  onEdit,
  onDelete,
  onTasks,
  onReport,
  onSearch,
  EditDisabled = false,
  DeleteDisabled = false,
  TasksDisabled = false,
}: UserTablePanelProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full p-2">
      {/* Группа кнопок слева */}
      <div className="flex space-x-2">
        <button
          onClick={onAdd}
          className="px-4 py-1.5 bg-green-100 border border-green-500 text-green-700 rounded hover:bg-green-200 transition-colors"
        >
          Добавить
        </button>

        <button
          onClick={onEdit}
          className={`px-4 py-1.5 rounded transition-colors ${
            EditDisabled
              ? `bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed`
              : `bg-blue-100 border border-blue-500 text-blue-700  hover:bg-blue-200 `
          } `}
          disabled={EditDisabled}
        >
          Редактировать
        </button>

        <button
          onClick={onDelete}
          className={`px-4 py-1.5 rounded transition-colors ${
            DeleteDisabled
              ? `bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed`
              : `bg-red-100 border border-red-500 text-red-700  hover:bg-red-200`
          } `}
          disabled={DeleteDisabled}
        >
          Удалить
        </button>
      </div>

      {/* Группа центральных кнопок */}
      <div className="flex space-x-2 ml-4">
        <button
          onClick={onTasks}
          className={`px-4 py-1.5 rounded transition-colors ${
            TasksDisabled
              ? `bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed`
              : `bg-purple-100 border border-purple-500 text-purple-700  hover:bg-purple-200`
          } `}
          disabled={TasksDisabled}
        >
          Задачи
        </button>

        <button
          onClick={onReport}
          className="px-4 py-1.5 bg-amber-100 border border-amber-500 text-amber-700 rounded hover:bg-amber-200 transition-colors"
        >
          Отчет
        </button>
      </div>

      {/* Поле поиска справа */}
      <div className="ml-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Поиск по ФИО"
          className="px-3 py-1.5 border border-gray-400 rounded w-64 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};
