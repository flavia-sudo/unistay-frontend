import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import CreateMaintenance from "./CreateMaintenance";
import UpdateMaintenance from "./UpdateMaintenance";
import DeleteMaintenance from "./DeleteMaintenance";
import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";
import { Search } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

type TMaintenanceWithRelations = TMaintenance & {
  hostelName?: string;
  roomNumber?: string;
};

const UserMaintenance = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  console.log("🔑 [UserMaintenance] userId from Redux:", userId);

  const { data: maintenanceData, isLoading, isError } =
    maintenanceAPI.useGetMaintenanceByUserIdQuery(userId!, {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    });

  console.log("📦 [UserMaintenance] raw maintenanceData from query:", maintenanceData);
  console.log("⏳ [UserMaintenance] isLoading:", isLoading, "| isError:", isError);

  const maintenances: TMaintenanceWithRelations[] = maintenanceData ?? [];

  console.log("📋 [UserMaintenance] maintenances array (after ?? []):", maintenances);
  console.log("📊 [UserMaintenance] maintenances.length:", maintenances.length);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "resolved" | "on progress" | "pending">("all");
  const [selectedMaintenance, setSelectedMaintenance] = useState<TMaintenanceWithRelations | null>(null);

  const filteredMaintenances = useMemo(() => {
    const result = maintenances.filter((m) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        m.issueTitle?.toLowerCase().includes(searchLower) ||
        m.hostelName?.toLowerCase().includes(searchLower) ||
        m.roomNumber?.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    console.log("🔍 [UserMaintenance] filteredMaintenances:", result);
    return result;
  }, [maintenances, search, statusFilter]);

  const total = maintenances.length;
  const resolved = maintenances.filter((m) => m.status === "resolved").length;
  const inProgress = maintenances.filter((m) => m.status === "on progress").length;
  const pending = maintenances.filter((m) => m.status === "pending").length;

  const handleEdit = (m: TMaintenanceWithRelations) => {
    setSelectedMaintenance(m);
    (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (m: TMaintenanceWithRelations) => {
    setSelectedMaintenance(m);
    (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 bg-linear-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-2xl shadow-sm px-8 py-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Maintenance Requests</h1>
            <p className="text-slate-800 mt-2">Track your reported maintenance issues</p>
          </div>
          <button
            className="bg-white text-emerald-700 font-medium px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            onClick={() => (document.getElementById("create_modal") as HTMLDialogElement)?.showModal()}
          >
            + Create Maintenance
          </button>
        </div>

        {/* Modals */}
        <CreateMaintenance />
        <UpdateMaintenance maintenance={selectedMaintenance} />
        <DeleteMaintenance maintenance={selectedMaintenance} />

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Requests" value={total} />
          <StatCard title="Resolved" value={resolved} />
          <StatCard title="In Progress" value={inProgress} />
          <StatCard title="Pending" value={pending} />
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by issue, hostel or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="resolved">Resolved</option>
            <option value="on progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500">Loading maintenance requests...</p>
          ) : isError ? (
            <p className="text-center text-red-500">Error loading maintenance</p>
          ) : filteredMaintenances.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No maintenance requests found</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Issue</th>
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
                    <td className="py-4 text-slate-600">{m.hostelName ?? "—"}</td>
                    <td className="py-4 text-slate-600">{m.roomNumber ?? "—"}</td>
                    <td className="py-4 text-slate-600">
                      {m.date_reported ? new Date(m.date_reported).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-md transition">
                      <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow-md transition"
                      >
                        <MdDeleteForever />
                      </button>
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

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <p className="text-slate-500 text-sm">{title}</p>
    <p className="text-2xl font-bold mt-2 text-slate-900">{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    resolved: "bg-emerald-100 text-emerald-700",
    "on progress": "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
  };
  const label: Record<string, string> = {
    resolved: "Resolved",
    "on progress": "In Progress",
    pending: "Pending",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-slate-100 text-slate-600"}`}>
      {label[status] ?? status}
    </span>
  );
};

export default UserMaintenance;