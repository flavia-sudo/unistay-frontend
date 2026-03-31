import { paymentsAPI, type TPayment } from "../../../features/paymentAPI";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";

type TPaymentWithRelations = TPayment & {
  firstName?: string;
  lastName?: string;
  hostelName?: string;
  roomNumber?: string;
  transactionId?: string;
  hostelId?: number;
};

const ViewPayment = () => {
  const { data: paymentsData, isLoading: paymentsLoading } =
    paymentsAPI.useGetPaymentsQuery();

  const { data: hostelsData, isLoading: hostelsLoading } =
    hostelsAPI.useGetHostelsQuery();

  const payments: TPaymentWithRelations[] = paymentsData?.data ?? [];
  const hostels: THostel[] = hostelsData?.data ?? [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Completed" | "Cancelled" | "Pending"
  >("all");

  const [landlordId, setLandlordId] = useState<number | null>(null);

  /* -------- Get landlord -------- */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role === "landlord") {
        setLandlordId(parsedUser.userId);
      }
    }
  }, []);

  /* -------- Landlord hostels -------- */

  const landlordHostels = useMemo(() => {
    return hostels.filter(
      (hostel: THostel) => hostel.userId === landlordId
    );
  }, [hostels, landlordId]);

  const hostelIds = landlordHostels.map(
    (hostel) => hostel.hostelId
  );

  /* -------- Filter payments -------- */

  const filteredPayments = useMemo(() => {
    return payments
      .filter((payment) =>
        hostelIds.includes(payment.hostelId ?? 0)
      )
      .filter((payment) => {
        const searchLower = search.toLowerCase();

        const matchesSearch =
          payment.firstName?.toLowerCase().includes(searchLower) ||
          payment.lastName?.toLowerCase().includes(searchLower) ||
          payment.hostelName?.toLowerCase().includes(searchLower) ||
          payment.roomNumber?.toLowerCase().includes(searchLower);

        const matchesStatus =
          statusFilter === "all" ||
          payment.paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;
      });
  }, [payments, hostelIds, search, statusFilter]);

  /* -------- Stats -------- */

  const total = filteredPayments.length;

  const completedPayments = filteredPayments.filter(
    (p) => p.paymentStatus === "Completed"
  ).length;

  const pendingPayments = filteredPayments.filter(
    (p) => p.paymentStatus === "Pending"
  ).length;

  const revenue = filteredPayments
    .filter((p) => p.paymentStatus === "Completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  if (paymentsLoading || hostelsLoading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading payments...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-8 py-12 w-full rounded-3xl">
          <h1 className="text-4xl font-bold text-slate-900">
            My Hostel Payments
          </h1>
          <p className="text-slate-700 mt-5">
            Payments from your hostels
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total" value={total} color="text-blue-600" bgColor="bg-blue-100" />
          <StatCard title="Confirmed" value={completedPayments} color="text-emerald-600" bgColor="bg-emerald-100" />
          <StatCard title="Pending" value={pendingPayments} color="text-rose-600" bgColor="bg-rose-100" />
          <StatCard title="Revenue" value={`Ksh ${revenue.toLocaleString()}`} color="text-sky-600" bgColor="bg-sky-100" />
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by hostel or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "Completed" | "Cancelled" | "Pending"
              )
            }
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No payments found
            </div>
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
                    <td className="py-4 font-medium text-slate-900">
                      {payment.firstName} {payment.lastName}
                    </td>

                    <td className="py-4 text-slate-600">
                      {payment.hostelName}
                    </td>

                    <td className="py-4 text-slate-600">
                      {payment.roomNumber}
                    </td>

                    <td className="py-4 text-slate-600">
                      Ksh {Number(payment.amount).toLocaleString()}
                    </td>

                    <td className="py-4 text-slate-600">
                      {payment.method}
                    </td>

                    <td className="py-4">
                      <StatusBadge status={payment.paymentStatus} />
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

export default ViewPayment;

/* ---------------- Reusable Components ---------------- */

const StatCard = ({
  title,
  value,
  color = "text-slate-900",
  bgColor = "bg-white",
}: {
  title: string;
  value: string | number;
  color?: string;
  bgColor?: string;
}) => (
  <div className={`rounded-2xl shadow-sm p-6 ${bgColor}`}>
    <p className="text-slate-500 text-sm">{title}</p>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles =
    status === "Completed"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
};