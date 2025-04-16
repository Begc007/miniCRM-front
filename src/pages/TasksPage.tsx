import { useMatch, useNavigate, useParams } from "react-router";
import { TaskTable } from "../components/features/tasks/TaskTable";
import { TaskTablePanel } from "../components/features/tasks/TaskTablePanel";
import { useEffect, useState } from "react";
import { PaginationParams } from "../types/pagination";
import { TaskAddForm } from "../components/features/tasks/TaskAddForm";
import { TaskItem, TaskItemForCreationDto } from "../types/task";
import { taskService } from "../services/taskService";
import { TaskEditForm } from "../components/features/tasks/TaskEditForm";
import { TaskDeleteConfirmation } from "../components/features/tasks/TaskDeleteConfirmation";

export const TasksPage = () => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const navigate = useNavigate();
  const isNewTask = useMatch("/tasks/:userId/new");
  const isEditTask = useMatch("/tasks/:id/edit");
  const isDeleteTask = useMatch("/tasks/:id/delete");
  const isTaskList = useMatch("/tasks/:userId");
  const { userId, id } = useParams();

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

    navigate(`/tasks/${userId}?${queryParams.toString()}`, { replace: true });
  };

  const handleTaskSelected = (newIds: string[]) => {
    setSelectedTaskIds(newIds);
  };

  const handleAdd = () => {
    navigate(`/tasks/${userId}/new`);
  };
  const handleEdit = () => {
    if (selectedTaskIds.length === 1) {
      navigate(`/tasks/${selectedTaskIds[0]}/edit`);
    }
  };
  const handleDelete = () => {
    if (selectedTaskIds.length === 1) {
      navigate(`/tasks/${selectedTaskIds[0]}/delete`);
    }
  };

  const handleTaskCreate = async (data: TaskItemForCreationDto) => {
    try {
      const resp = await taskService.create(data);
      if (resp.success) {
        navigate(`/tasks/${userId}`);
      } else {
        console.error("Failed to create task:", resp.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const getUserIdByTaskId = async (taskId: number) => {
    const taskResponse = await taskService.getById(taskId);
    return taskResponse.success ? taskResponse.data?.userId : null;
  };

  const handleTaskDelete = async (id: number) => {
    try {
      const resp = await taskService.delete(id);
      if (resp.success) {
        navigate(`/tasks/${await getUserIdByTaskId(id)}`);
      } else {
        console.error("Failed to delete task:", resp.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const handleTaskUpdate = async (taskId: number, taskData: TaskItem) => {
    try {
      const resp = await taskService.update(taskId, taskData);

      if (resp.success) {
        navigate(`/tasks/${await getUserIdByTaskId(taskId)}`);
      } else {
        console.error("Failed to update task:", resp.message); //TODO: make this error component
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  //routing
  if (isNewTask) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Новая задача</h1>
        <TaskAddForm
          userId={userId}
          onCreate={handleTaskCreate}
          onCancel={() => {
            navigate(`tasks/${userId}`);
          }}
          isLoading={false}
        />
      </div>
    );
  }

  if (isEditTask) {
    const taskId = parseInt(id);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Редактирование задачи</h1>
        <TaskEditForm
          taskId={taskId} //TODO: resolve later
          onCancel={() => navigate(`/tasks/${userId}`)}
          onUpdate={handleTaskUpdate}
        />
      </div>
    );
  }

  if (isDeleteTask) {
    const taskId = parseInt(id);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Редактирование задачи</h1>
        <TaskDeleteConfirmation
          id={taskId} //TODO: resolve later
          onConfirm={handleTaskDelete}
          onCancel={() => navigate(`/users`)} //TODO: fix to return back to userId not all users
        />
      </div>
    );
  }

  if (isTaskList) {
    return (
      <div>
        <TaskTablePanel
          EditDisabled={selectedTaskIds.length !== 1}
          DeleteDisabled={selectedTaskIds.length === 0}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <TaskTable
          userId={parseInt(userId)}
          onTaskSelected={handleTaskSelected}
          paginationParams={paginationParams}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    );
  }
};
