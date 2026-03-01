import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";
import { useMemo, useState } from "react";
import { Search, Edit } from "lucide-react";
import UpdateMaintenance from "./UpdateMaintenance";

type TMaintenanceWithRelations = TMaintenance & {
  firstName?: string;
  lastName?: string;
  hostelName?: string;
  roomNumber?: string;
};

const Maintenance = () => {
  const { data: maintenanceData, isLoading } =
    maintenanceAPI.useGetMaintenancesQuery();

  const maintenances: TMaintenanceWithRelations[] =
    maintenanceData?.data ?? [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "resolved" | "pending">("all");
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<TMaintenanceWithRelations | null>(null);

  const filteredMaintenances = useMemo(() => {
    return maintenances.filter((maintenance) => {
      const searchLower = search.toLowerCase();

      const matchesSearch =
        maintenance.issueTitle?.toLowerCase().includes(searchLower) ||
        maintenance.firstName?.toLowerCase().includes(searchLower) ||
        maintenance.lastName?.toLowerCase().includes(searchLower) ||
        maintenance.hostelName?.toLowerCase().includes(searchLower) ||
        maintenance.roomNumber?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "resolved" && maintenance.status === true) ||
        (statusFilter === "pending" && maintenance.status === false);

      return matchesSearch && matchesStatus;
    });
  }, [maintenances, search, statusFilter]);

  const total = maintenances.length;
  const resolved = maintenances.filter((m) => m.status === true).length;
  const pending = maintenances.filter((m) => m.status === false).length;

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Maintenance Requests
          </h1>
          <p className="text-slate-500 mt-1">
            Track and manage all reported issues
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Requests" value={total} />
          <StatCard title="Resolved" value={resolved} />
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
                e.target.value as "all" | "resolved" | "pending"
              )
            }
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500">
              Loading maintenance requests...
            </p>
          ) : filteredMaintenances.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg font-medium">
                No maintenance requests found
              </p>
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
                {filteredMaintenances.map((maintenance) => (
                  <tr
                    key={maintenance.maintenanceId}
                    className="border-b last:border-none"
                  >
                    <td className="py-4 font-medium text-slate-900">
                      {maintenance.issueTitle}
                    </td>

                    <td className="py-4 text-slate-600">
                      {maintenance.firstName} {maintenance.lastName}
                    </td>

                    <td className="py-4 text-slate-600">
                      {maintenance.hostelName}
                    </td>

                    <td className="py-4 text-slate-600">
                      {maintenance.roomNumber}
                    </td>

                    <td className="py-4 text-slate-600">
                      {new Date(
                        maintenance.date_reported
                      ).toLocaleDateString()}
                    </td>

                    <td className="py-4">
                      <StatusBadge status={maintenance.status} />
                    </td>

                    <td className="py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedMaintenance(maintenance);
                          (
                            document.getElementById(
                              "update_modal"
                            ) as HTMLDialogElement
                          )?.showModal();
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

      <UpdateMaintenance maintenance={selectedMaintenance} />
    </div>
  );
};

export default Maintenance;

/* ---------------- Reusable Components ---------------- */

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <p className="text-slate-500 text-sm">{title}</p>
    <p className="text-2xl font-bold mt-2 text-slate-900">{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: boolean }) => {
  const label = status ? "Resolved" : "Pending";

  const styles = status
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
};