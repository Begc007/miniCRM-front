import React, { useState } from "react";

interface TaskTablePanelProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  EditDisabled: boolean;
  DeleteDisabled: boolean;
}

export const TaskTablePanel = ({
  onAdd,
  onEdit,
  onDelete,
  EditDisabled = false,
  DeleteDisabled = false,
}: TaskTablePanelProps) => {
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
          className="px-4 py-1.5 bg-blue-100 border border-blue-500 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          disabled={EditDisabled}
        >
          Редактировать
        </button>

        <button
          onClick={onDelete}
          className="px-4 py-1.5 bg-red-100 border border-red-500 text-red-700 rounded hover:bg-red-200 transition-colors"
          disabled={DeleteDisabled}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};
