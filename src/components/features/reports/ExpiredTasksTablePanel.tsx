import React, { useState } from "react";

interface ExpiredTasksTablePanelProps {
  onPrint?: () => void;
}
//TODO: all table panels can be made common single component
export const ExpiredTasksTablePanel = ({
  onPrint,
}: ExpiredTasksTablePanelProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 w-full p-2">
      <div className="flex space-x-2">
        <button
          onClick={onPrint}
          className="px-4 py-1.5 bg-green-100 border border-green-500 text-green-700 rounded hover:bg-green-200 transition-colors"
        >
          Печать
        </button>
      </div>
    </div>
  );
};
