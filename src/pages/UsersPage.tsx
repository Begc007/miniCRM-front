import { useMatch, useLocation, useNavigate, useParams } from "react-router";
import { UserTable } from "../components/features/users/UserTable";
import { PaginationParams } from "../types/pagination";
import { useEffect, useState } from "react";
import { UserTablePanel } from "../components/features/users/UserTablePanel";
import { UserForCreationDto, UserForUpdateDto } from "../types/user";
import { UserAddForm } from "../components/features/users/UserAddForm";
import { userService } from "../services/userService";
import { UserEditForm } from "../components/features/users/UserEditForm";
import { UserDeleteConfirmation } from "../components/features/users/UserDeleteConfirmation";

export const UsersPage = () => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isNewUser = useMatch("/users/new");
  const isEditUser = useMatch("/users/:id/edit");
  const isDeleteUser = useMatch("/users/:id/delete");
  const isUsersList = useMatch("/users");
  const { id } = useParams();

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
    const sortBy = queryParams.get("sort") || "name";
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

    navigate(`/users?${queryParams.toString()}`, { replace: true });
  };

  const handleUserSelected = (newIds: string[]) => {
    setSelectedUserIds(newIds);
  };

  const handleAdd = () => {
    navigate("/users/new");
  };
  const handleEdit = () => {
    if (selectedUserIds.length === 1) {
      navigate(`/users/${selectedUserIds[0]}/edit`);
    }
  };
  const handleDelete = () => {
    if (selectedUserIds.length === 1) {
      navigate(`/users/${selectedUserIds[0]}/delete`);
    }
  };

  const handleTasks = () => {
    if (selectedUserIds.length === 1) {
      navigate(`/tasks/${selectedUserIds[0]}`);
    }
  };

  const handleSearch = () => {
    console.log("search");
  };

  const handleReport = () => {
    console.log("report");
  };

  const handleCreateUser = async (userData: UserForCreationDto) => {
    try {
      const resp = await userService.create(userData);
      if (resp.success) {
        navigate("/users");
      } else {
        console.error("Failed to create user:", resp.message); //TODO: create error component and show in the top
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = async (userId: number, userData: UserForUpdateDto) => {
    try {
      const resp = await userService.edit(userId, userData);
      if (resp.success) {
        navigate("/users");
      } else {
        console.error("Failed to update user:", resp.message); //TODO: create error component and show in the top
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const resp = await userService.delete(userId);
      if (resp.success) {
        navigate("/users");
      } else {
        console.error("Failed to delete user:", resp.message); //TODO: create error component and show in the top
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (isNewUser) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Новый пользователь</h1>
        <UserAddForm
          onSubmit={handleCreateUser}
          isLoading={false} // true when API call is in progress
        />
      </div>
    );
  }
  if (isEditUser) {
    const userId = parseInt(id || "");
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Редактирование пользователя</h1>
        <UserEditForm
          id={userId}
          onSubmit={handleEditUser}
          isLoading={false} // true when API call is in progress
        />
      </div>
    );
  }
  if (isDeleteUser) {
    const userId = parseInt(id || "");
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Удаление пользователя</h1>
        <UserDeleteConfirmation
          id={userId}
          onConfirm={handleDeleteUser}
          onCancel={() => navigate("/users")}
        />
      </div>
    );
  }
  if (isUsersList) {
    return (
      <div>
        <UserTablePanel
          EditDisabled={selectedUserIds.length !== 1}
          DeleteDisabled={selectedUserIds.length === 0}
          TasksDisabled={selectedUserIds.length !== 1}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearch={handleSearch}
          onTasks={handleTasks}
          onReport={handleReport}
        />
        <UserTable
          paginationParams={paginationParams}
          onPaginationChange={handlePaginationChange}
          onUserSelected={handleUserSelected}
        />
      </div>
    );
  }
};
