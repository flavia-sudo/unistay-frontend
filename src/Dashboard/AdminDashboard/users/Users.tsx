import { useMemo, useState } from "react";
import { usersAPI, type TUser } from "../../../features/userAPI";
import UpdateProfile from "./Update";
import DeleteUser from "./DeleteUser";
import { Search, Edit, Trash2 } from "lucide-react";


const Users = () => {
  const { data, isLoading} =
    usersAPI.useGetUsersQuery(undefined);
    const users = data?.data ?? [];

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "Student" | "Landlord" | "Admin">("all");
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

    const filteredUsers = useMemo(() => {
        return (users as TUser[]).filter((user) => {
            const searchLower = search.toLowerCase();

        const matchesSearch = 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

        const matchesRoles = 
        roleFilter === "all" ||
        (roleFilter === "Student" && user.role === "student") ||
        (roleFilter === "Landlord" && user.role === "Landlord") ||
        (roleFilter === "Admin" && user.role === "admin");

        return matchesSearch && matchesRoles;
        });
    }, [users, search, roleFilter]);

    const totalUsers = users.length;
    const students = (users as TUser[]).filter((user) => user.role === "student");
    const landlords = (users as TUser[]).filter((user) => user.role === "Landlord");
    const admins = (users as TUser[]).filter((user) => user.role === "admin");

  return (
    <div className="p-6 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Users</h1>
                <p className="text-slate-500 mt-1">Manage all registered users</p>
            </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold">{totalUsers}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Students</p>
          <h2 className="text-3xl font-bold text-green-600">{students.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Landlords</p>
          <h2 className="text-3xl font-bold text-blue-600">{landlords.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Admins</p>
          <h2 className="text-3xl font-bold text-purple-600">{admins.length}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-2/3">
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400"/>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        </div>

        <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value as "all" | "Student" | "Landlord" | "Admin")}
        className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
        <option value="all">All Roles</option>
        <option value="Student">Student</option>
        <option value="Landlord">Landlord</option>
        <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {isLoading ? (
            <p className="text-center text-slate-500">Loading...</p>
        ) : (
            <table className="w-full text-left">
                <thead>
                    <tr className="text-slate-500 text-sm border-b">
                        <th className="pb-3">First Name</th>
                        <th className="pb-3">Last Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Verified</th>
                        <th className="pb-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.userId} className="border-b last:border-none">
                            <td className="py-4 font-medium text-slate-900">
                                {user.firstName}
                            </td>.
                            <td className="py-4 font-medium text-slate-900">
                                {user.lastName}
                            </td>
                            <td className="py-4 font-medium text-slate-900">
                                {user.email}
                            </td>
                            <td className="py-4 text-slate-600">
                                {user.role}
                            </td>
                            <td className="py-4 text-slate-600">
                                {user.verified ? "Yes" : "No"}
                            </td>
                            <td className="py-4 text-right space-x-2">
                                <button
                                onClick={() => {
                                    setSelectedUser(user);
                                    (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
                                }}
                                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600">
                                    <Edit size={16} />
                                </button>
                                <button
                                onClick={() => {
                                    setSelectedUser(user);
                                    (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
                                }}
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>

    <UpdateProfile user={selectedUser} />
    <DeleteUser user={selectedUser} />
    </div>
  )
}
export default Users;