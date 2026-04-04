import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { Search, Users } from "lucide-react";
import { usersAPI, type TUser } from "../../../features/userAPI";
import { hostelsAPI } from "../../../features/hostelAPI";
import { bookingsAPI, type TBooking } from "../../../features/bookingAPI";

const ViewUsers = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const { data: users = [], isLoading } = usersAPI.useGetUsersQuery();
  const { data: hostels = [] } = hostelsAPI.useGetHostelsQuery(undefined);
  const { data: bookings = [] } = bookingsAPI.useGetBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [search, setSearch] = useState("");

  const landlordHostels = useMemo(
    () => hostels.filter((h) => h.userId === userId),
    [hostels, userId]
  );

  const landlordHostelNames = useMemo(
    () => new Set(landlordHostels.map((h) => h.hostelName)),
    [landlordHostels]
  );

  const landlordBookings = useMemo(() => {
    if (!landlordHostelNames.size) return [];
    return bookings.filter((b: TBooking) => landlordHostelNames.has(b.hostelName));
  }, [bookings, landlordHostelNames]);

  const studentIds = useMemo(
    () => new Set(landlordBookings.map((b) => b.userId)),
    [landlordBookings]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u: TUser) =>
          studentIds.has(u.userId) &&
          `${u.firstName} ${u.lastName} ${u.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [users, studentIds, search]
  );

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-2xl px-8 py-10">
          <h1 className="text-3xl font-bold">Students in your hostels</h1>
          <p className="text-indigo-100 mt-2">Based on bookings</p>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500 py-8">Loading students...</p>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Users className="w-14 h-14 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No students found in your hostels</p>
            </div>
          ) : (
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
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="border-b last:border-none">
                    <td className="py-4">{user.firstName}</td>
                    <td className="py-4">{user.lastName}</td>
                    <td className="py-4">{user.email}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewUsers;