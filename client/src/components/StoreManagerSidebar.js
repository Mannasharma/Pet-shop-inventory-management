import React, { useEffect, useState } from "react";
import { X, UserPlus, Users, Trash2, Eye, EyeOff } from "lucide-react";
import { userAPI } from "../services/api";

const StoreManagerSidebar = ({ open, mode, onClose, isDarkMode }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    name: "",
    role: "NORMAL",
    password: "",
  });
  const [addSuccess, setAddSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open && mode === "existing") fetchUsers();
    // Reset form and state on open
    if (open && mode === "add") {
      setForm({ username: "", name: "", role: "NORMAL", password: "" });
      setAddSuccess("");
      setError("");
      setShowPassword(false);
    }
  }, [open, mode]);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.getAll();
      setUsers(res.users || []);
    } catch (err) {
      setError("Failed to fetch users");
    }
    setLoading(false);
  }

  async function handleAddUser(e) {
    e.preventDefault();
    setError("");
    setAddSuccess("");
    try {
      await userAPI.add(form);
      setAddSuccess("User added successfully!");
      setForm({ username: "", name: "", role: "NORMAL", password: "" });
    } catch (err) {
      setError("Failed to add user");
    }
  }

  async function handleDeleteUser(username) {
    setDeleteLoading(true);
    setError("");
    try {
      await userAPI.delete([username]);
      setUsers((prev) => prev.filter((u) => u.username !== username));
    } catch (err) {
      setError("Failed to delete user");
    }
    setDeleteLoading(false);
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      } flex flex-col ${
        isDarkMode
          ? "bg-gray-900 text-white border-l border-gray-700"
          : "bg-white text-gray-900"
      }`}
      style={{ maxWidth: 400 }}
    >
      <div
        className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h2 className="text-lg font-bold flex items-center gap-2">
          {mode === "existing" ? <Users /> : <UserPlus />}{" "}
          {mode === "existing" ? "Existing Users" : "Add User"}
        </h2>
        <button
          onClick={onClose}
          className={`p-2 rounded ${
            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
          }`}
        >
          <X />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {mode === "existing" && (
          <>
            {loading ? (
              <div>Loading users...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <li
                    key={user.username}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Role: {user.role}
                      </div>
                    </div>
                    <button
                      className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                      onClick={() => handleDeleteUser(user.username)}
                      disabled={deleteLoading}
                      title="Delete user"
                    >
                      <Trash2 />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {mode === "add" && (
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="ADMIN">Admin</option>
                <option value="NORMAL">Normal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full border rounded px-3 py-2 pr-10 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {addSuccess && <div className="text-green-600">{addSuccess}</div>}
            <button
              type="submit"
              className={`w-full py-2 rounded font-semibold ${
                isDarkMode
                  ? "bg-blue-700 hover:bg-blue-800 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Add User
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StoreManagerSidebar;
