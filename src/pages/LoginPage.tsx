import React, { useState } from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? "Mini CRM" : "Регистрация"}
          </h1>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-6 text-center border-t border-gray-200 pt-4">
            {isLogin ? (
              <p className="text-sm text-gray-600">
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  onClick={() => setIsLogin(false)}
                >
                  Регистрация
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  onClick={() => setIsLogin(true)}
                >
                  Войти
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
