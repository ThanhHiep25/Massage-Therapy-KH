import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Icon từ lucide-react (có thể đổi sang MUI)

const SettingsDetail: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  // Khi theme thay đổi -> cập nhật class của <html> và lưu vào localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex flex-col items-center justify-center  bg-white dark:bg-gray-800 p-9" style={
      {
        borderRadius: '10px',
        height: '100vh',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }
    }>
      <h1 className="font-semibold text-4xl text-gray-900 dark:text-white border-b pb-2 w-full text-center">
        Cài đặt
      </h1>

      <div className="w-3/4 mt-5 space-y-6 p-4 border rounded-lg shadow-md">
        {/* Ngôn ngữ */}
        <div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Ngôn ngữ</p>
          <select
            className="border-2 border-gray-300 rounded-md w-full p-2 mt-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Chế độ */}
        <div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Chế độ</p>
          <div className="flex items-center gap-4">
            <button
              className={`flex items-center gap-2 p-2 rounded-lg transition ${
                theme === "light"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun className="w-5 h-5" />
              Light
            </button>

            <button
              className={`flex items-center gap-2 p-2 rounded-lg transition ${
                theme === "dark"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon className="w-5 h-5" />
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDetail;
