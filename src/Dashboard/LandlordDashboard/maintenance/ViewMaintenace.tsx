import { useMemo, useState } from "react";
import { Search, Edit } from "lucide-react";
import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";
import UpdateMaintenanceLandlord from "./UpdateMaintenance";

type TMaintenanceWithRelations = TMaintenance & {
  firstName?: string;
  lastName?: string;
  hostelName?: string;
  roomNumber?: string;
};

const MaintenanceLandlord = () => {
  const userId = Number(localStorage.getItem("userId")); // get landlord ID
  const { data: maintenanceData, isLoading } = maintenanceAPI.useGetMaintenancesQuery();

  // Filter only the maintenance requests belonging to the landlord's hostels
  const maintenances: TMaintenanceWithRelations[] = (maintenanceData?.data ?? []).filter(
    (m) => m.userId === userId // assumes each maintenance record has landlordId
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "resolved" | "on progress" | "pending">("all");
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<TMaintenanceWithRelations | null>(null);

  const filteredMaintenances = useMemo(() => {
    return maintenances.filter((m) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        m.issueTitle?.toLowerCase().includes(searchLower) ||
        m.firstName?.toLowerCase().includes(searchLower) ||
        m.lastName?.toLowerCase().includes(searchLower) ||
        m.hostelName?.toLowerCase().includes(searchLower) ||
        m.roomNumber?.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [maintenances, search, statusFilter]);

  const total = maintenances.length;
  const resolved = maintenances.filter((m) => m.status === "resolved").length;
  const inProgress = maintenances.filter((m) => m.status === "on progress").length;
  const pending = maintenances.filter((m) => m.status === "pending").length;

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-linear-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-2xl shadow-sm px-8 py-10">
          <h1 className="text-4xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="text-slate-800 mt-4">Track and manage all reported issues in your hostels</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Requests" value={total} />
          <StatCard title="Resolved" value={resolved} />
          <StatCard title="In Progress" value={inProgress} />
          <StatCard title="Pending" value={pending} />
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
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
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "resolved" | "on progress" | "pending"
              )
            }
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="resolved">Resolved</option>
            <option value="on progress">On Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500">Loading maintenance requests...</p>
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
                    <td className="py-4 text-right">
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
  let styles = "";
  let label = status;

  if (status === "resolved") {
    styles = "bg-emerald-100 text-emerald-700";
    label = "Resolved";
  } else if (status === "on progress") {
    styles = "bg-blue-100 text-blue-700";
    label = "On Progress";
  } else if (status === "pending") {
    styles = "bg-amber-100 text-amber-700";
    label = "Pending";
  }

  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>{label}</span>;
};