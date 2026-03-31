import { useEffect, useMemo, useState } from "react";
import { usersAPI, type TUser } from "../../../features/userAPI";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import { Search } from "lucide-react";

const ViewUsers = () => {
  const { data: usersData, isLoading: usersLoading } =
    usersAPI.useGetUsersQuery();

  const { data: hostelsData, isLoading: hostelsLoading } =
    hostelsAPI.useGetHostelsQuery();

  const users = usersData?.data ?? [];
  const hostels = hostelsData?.data ?? [];

  const [landlordId, setLandlordId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // Get logged in landlord from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("landlord");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role === "landlord") {
        setLandlordId(parsedUser.userId);
      }
    }
  }, []);

  // Hostels owned by this landlord
  const landlordHostels = useMemo(() => {
    return hostels.filter(
      (hostel: THostel) => hostel.userId === landlordId
    );
  }, [hostels, landlordId]);

  // Get hostel IDs
  const hostelIds = landlordHostels.map(
    (hostel: THostel) => hostel.hostelId
  );

  // Users in those hostels
  const filteredUsers = useMemo(() => {
    return users
      .filter((user: any) =>
        hostelIds.includes(user.hostelId)
      )
      .filter((user: TUser) => {
        const searchLower = search.toLowerCase();

        return (
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      });
  }, [users, hostelIds, search]);

  if (usersLoading || hostelsLoading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-2xl px-8 py-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Hostel Users
          </h1>
          <p className="text-slate-900 mt-3">
            Students in your hostels
          </p>
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b">
                <th className="pb-3">First Name</th>
                <th className="pb-3">Last Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-500">
                    No users found in your hostels
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: TUser) => (
                  <tr key={user.userId} className="border-b last:border-none">
                    <td className="py-4 font-medium text-slate-900">
                      {user.firstName}
                    </td>

                    <td className="py-4 text-slate-700">
                      {user.lastName}
                    </td>

                    <td className="py-4 text-slate-700">
                      {user.email}
                    </td>

                    <td className="py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ViewUsers;