import { useState } from "react";
import CreateMaintenance from "./CreateMaintenance";
import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";
import { Search } from "lucide-react";

type TMaintenanceWithRelations = TMaintenance & {
  hostelName?: string;
  roomNumber?: string;
};

const UserMaintenance = () => {
  const user = JSON.parse(localStorage.getItem("User") || "{}");
  const userId = user.userId;

  const { data: maintenanceData, isLoading, error } = maintenanceAPI.useGetMaintenanceByUserIdQuery(userId);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "resolved" | "pending">("all");

  const maintenances: TMaintenanceWithRelations[] = maintenanceData?.data ?? [];

  const filteredMaintenances = maintenances.filter((m) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = m.issueTitle?.toLowerCase().includes(searchLower) ||
                          m.hostelName?.toLowerCase().includes(searchLower) ||
                          m.roomNumber?.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "resolved" && m.status === true) ||
      (statusFilter === "pending" && m.status === false);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">My Maintenance Requests</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg" onClick={() => (document.getElementById("create_modal") as HTMLDialogElement)?.showModal()}>
          + Create Maintenance
        </button>
      </div>

      <CreateMaintenance />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by issue..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500">
          <option value="all">All Status</option>
          <option value="resolved">Resolved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {isLoading && <p className="text-gray-600">Loading maintenance requests...</p>}
      {error && <p className="text-red-600">Error loading maintenance requests</p>}

      {filteredMaintenances.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-4 text-left">Issue</th>
                <th className="px-4 py-4 text-left">Hostel</th>
                <th className="px-4 py-4 text-left">Room</th>
                <th className="px-4 py-4 text-left">Date Reported</th>
                <th className="px-4 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredMaintenances.map((m) => (
                <tr key={m.maintenanceId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{m.issueTitle}</td>
                  <td className="px-4 py-3">{m.hostelName}</td>
                  <td className="px-4 py-3">{m.roomNumber}</td>
                  <td className="px-4 py-3">{new Date(m.date_reported).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{m.status ? "Resolved" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && !error && <p className="text-gray-600 mt-6 text-center">No maintenance requests found</p>
      )}
    </div>
  );
};

export default UserMaintenance;