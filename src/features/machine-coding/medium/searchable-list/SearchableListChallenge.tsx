import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, name: "Aditya Srivastava", email: "aditya@example.com", role: "Software Engineer II" },
  { id: 2, name: "Sarah Jenkins", email: "sarah@example.com", role: "Product Manager" },
  { id: 3, name: "Michael Chen", email: "michael@example.com", role: "Frontend Developer" },
  { id: 4, name: "Emma Watson", email: "emma@example.com", role: "UI/UX Designer" },
  { id: 5, name: "David Miller", email: "david@example.com", role: "Backend Developer" },
];

export const SearchableListChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const roles = ["All", ...Array.from(new Set(mockUsers.map((u) => u.role)))];

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === "All" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`px-3 py-1.5 border rounded text-xs sm:text-sm ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          }`}
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className={`px-3 py-1.5 border rounded text-xs sm:text-sm ${
            theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
          }`}>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {filteredUsers.length === 0 ? (
          <div className="col-span-2 p-4 text-center text-xs text-gray-500">
            No users found matching search criteria.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`p-3.5 rounded border space-y-1 ${
                theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              }`}>
              <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">{user.name}</h4>
              <p className="text-xs text-gray-500">{user.email}</p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                {user.role}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchableListChallenge;
