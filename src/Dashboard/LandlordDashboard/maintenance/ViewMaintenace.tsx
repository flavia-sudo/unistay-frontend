import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { Search, Edit } from "lucide-react";
import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";
import { hostelsAPI } from "../../../features/hostelAPI";
import UpdateMaintenanceLandlord from "./UpdateMaintenance";

const MaintenanceLandlord = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const { data: maintenances = [], isLoading } = maintenanceAPI.useGetMaintenancesQuery();
  const { data: hostels = [] } = hostelsAPI.useGetHostelsQuery(undefined);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "resolved" | "on progress" | "pending">("all");
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<TMaintenance | null>(null);

  const landlordHostelNames = useMemo(
    () => new Set(hostels.filter((h) => h.userId === userId).map((h) => h.hostelName)),
    [hostels, userId]
  );

  const filteredMaintenances = useMemo(() => {
    if (!landlordHostelNames.size) return [];

    return maintenances.filter((m: TMaintenance) => {
      const inHostel = landlordHostelNames.has(m.hostelName ?? "");

      const matchesSearch = `${m.issueTitle} ${m.firstName} ${m.lastName} ${m.hostelName} ${m.roomNumber}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || m.status === statusFilter;

      return inHostel && matchesSearch && matchesStatus;
    });
  }, [maintenances, landlordHostelNames, search, statusFilter]);

  const resolved   = filteredMaintenances.filter((m) => m.status === "resolved").length;
  const inProgress = filteredMaintenances.filter((m) => m.status === "on progress").length;
  const pending    = filteredMaintenances.filter((m) => m.status === "pending").length;

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 bg-linear-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-2xl shadow-sm px-8 py-10">
          <h1 className="text-4xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="text-slate-800 mt-4">Track and manage all reported issues in your hostels</p>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Requests" value={filteredMaintenances.length} />
          <StatCard title="Resolved"       value={resolved} />
          <StatCard title="In Progress"    value={inProgress} />
          <StatCard title="Pending"        value={pending} />
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by issue, hostel, or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="resolved">Resolved</option>
            <option value="on progress">On Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500 py-8">Loading maintenance requests...</p>
          ) : filteredMaintenances.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg font-medium">No maintenance requests found</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Issue</th>
                  <th className="pb-3">Reported By</th>
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Date Reported</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaintenances.map((m) => (
                  <tr key={m.maintenanceId} className="border-b last:border-none">
                    <td className="py-4 font-medium text-slate-900">{m.issueTitle}</td>
                    <td className="py-4 text-slate-600">{m.firstName} {m.lastName}</td>
                    <td className="py-4 text-slate-600">{m.hostelName}</td>
                    <td className="py-4 text-slate-600">{m.roomNumber}</td>
                    <td className="py-4 text-slate-600">{new Date(m.date_reported).toLocaleDateString()}</td>
                    <td className="py-4"><StatusBadge status={m.status} /></td>
                    <td className="py-4">
                      <button
                        onClick={() => {
                          setSelectedMaintenance(m);
                          (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
                        }}
                        className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <UpdateMaintenanceLandlord maintenance={selectedMaintenance} />
    </div>
  );
};

export default MaintenanceLandlord;

/* ---------------- Reusable Components ---------------- */
const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <p className="text-slate-500 text-sm">{title}</p>
    <p className="text-2xl font-bold mt-2 text-slate-900">{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles =
    status === "resolved"    ? "bg-emerald-100 text-emerald-700" :
    status === "on progress" ? "bg-blue-100 text-blue-700"       :
                               "bg-amber-100 text-amber-700";
  const label =
    status === "resolved"    ? "Resolved"    :
    status === "on progress" ? "On Progress" : "Pending";

  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>{label}</span>;
};