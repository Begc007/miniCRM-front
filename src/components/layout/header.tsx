import { Link } from "react-router";
import { authService } from "../../services/authService";

export const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-xl font-bold text-gray-800 cursor-pointer"
          >
            mini CRM
          </Link>

          <nav className="hidden md:flex space-x-10">
            <Link
              to="/tasks"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Задачи
            </Link>
            <Link
              to="/users"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Сотрудники
            </Link>
            <Link
              to="/reports/expired-tasks"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Отчет
            </Link>
            <button
              onClick={() => authService.logout()}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Выйти
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
