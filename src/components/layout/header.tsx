import { useState } from "react";
import { Link } from "react-router";

export const Header = () => {
  //   const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              to="/reports"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Отчет
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
