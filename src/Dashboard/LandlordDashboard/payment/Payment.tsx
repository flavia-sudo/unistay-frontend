import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { Search } from "lucide-react";
import { paymentsAPI, type TPayment } from "../../../features/paymentAPI";
import { hostelsAPI } from "../../../features/hostelAPI";

const ViewPayment = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const { data: payments = [], isLoading: paymentsLoading } =
    paymentsAPI.useGetPaymentsQuery();

  const { data: hostels = [], isLoading: hostelsLoading } =
    hostelsAPI.useGetHostelsQuery(undefined);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Completed" | "Cancelled" | "Pending">("all");

  const landlordHostels = useMemo(
    () => hostels.filter((h) => h.userId === userId),
    [hostels, userId]
  );

  const landlordHostelNames = useMemo(
    () => new Set(landlordHostels.map((h) => h.hostelName)),
    [landlordHostels]
  );

  const filteredPayments = useMemo(() => {
    if (!landlordHostelNames.size) return [];

    return payments.filter((p: TPayment) => {
      const inHostel = landlordHostelNames.has(p.hostelName ?? "");

      const matchesSearch = `${p.firstName} ${p.lastName} ${p.hostelName} ${p.roomNumber}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || p.paymentStatus === statusFilter;

      return inHostel && matchesSearch && matchesStatus;
    });
  }, [payments, landlordHostelNames, search, statusFilter]);

  /* -------- Stats -------- */
  const completedPayments = filteredPayments.filter((p) => p.paymentStatus === "Completed").length;
  const pendingPayments   = filteredPayments.filter((p) => p.paymentStatus === "Pending").length;
  const revenue = filteredPayments
    .filter((p) => p.paymentStatus === "Completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  if (paymentsLoading || hostelsLoading) {
    return <div className="p-6 text-center text-slate-500">Loading payments...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-8 py-12 rounded-3xl">
          <h1 className="text-4xl font-bold">My Hostel Payments</h1>
          <p className="text-blue-100 mt-3">Payments from your hostels</p>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total"     value={filteredPayments.length} color="text-blue-600"    bgColor="bg-blue-50" />
          <StatCard title="Completed" value={completedPayments}       color="text-emerald-600" bgColor="bg-emerald-50" />
          <StatCard title="Pending"   value={pendingPayments}         color="text-yellow-600"  bgColor="bg-yellow-50" />
          <StatCard title="Revenue"   value={`Ksh ${revenue.toLocaleString()}`} color="text-sky-600" bgColor="bg-sky-50" />
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by hostel or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No payments found</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Paid By</th>
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.paymentId} className="border-b last:border-none">
                    <td className="py-4 font-medium">{payment.firstName} {payment.lastName}</td>
                    <td className="py-4">{payment.hostelName}</td>
                    <td className="py-4">{payment.roomNumber}</td>
                    <td className="py-4 font-semibold">Ksh {Number(payment.amount).toLocaleString()}</td>
                    <td className="py-4">{payment.method}</td>
                    <td className="py-4"><StatusBadge status={payment.paymentStatus} /></td>
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

export default ViewPayment;

/* ---------------- Reusable Components ---------------- */

const StatCard = ({
  title, value, color = "text-slate-900", bgColor = "bg-white",
}: {
  title: string; value: string | number; color?: string; bgColor?: string;
}) => (
  <div className={`rounded-2xl shadow-sm p-6 ${bgColor}`}>
    <p className="text-slate-500 text-sm">{title}</p>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles =
    status === "Completed" ? "bg-emerald-100 text-emerald-700" :
    status === "Pending"   ? "bg-yellow-100 text-yellow-700"   :
                             "bg-red-100 text-red-700";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
};