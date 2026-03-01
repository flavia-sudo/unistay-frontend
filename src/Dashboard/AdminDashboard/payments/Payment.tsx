import { paymentsAPI, type TPayment } from "../../../features/paymentAPI";
import { useMemo, useState } from "react";
import { Search, Edit } from "lucide-react";
import UpdatePayment from "./UpdatePayment";

type TPaymentWithRelations = TPayment & {
    firstName?: string
    lastName?: string
    hostelName?: string
    roomNumber?: string
}

const Payment = () => {
    const { data: paymentsData, isLoading } = paymentsAPI.useGetPaymentsQuery();

    const payments: TPaymentWithRelations[] = paymentsData?.data ?? [];
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");
    const [selectedPayment, setSelectedPayment] = useState<TPaymentWithRelations | null>(null);

    const filteredPayments = useMemo(() => {
        return (payments as TPaymentWithRelations[]).filter((payment) => {
            const searchLower = search.toLowerCase();
            const matchesSearch = 
            payment.firstName?.toLowerCase().includes(searchLower) ||
            payment.lastName?.toLowerCase().includes(searchLower) ||
            payment.hostelName?.toLowerCase().includes(searchLower) ||
            payment.roomNumber?.toLowerCase().includes(searchLower);

            const matchesStatus = 
            statusFilter === "all" ||
            (statusFilter === "confirmed" && payment.paymentStatus === true) ||
            (statusFilter === "pending" && payment.paymentStatus === false);

            return matchesSearch && matchesStatus;
        });
    }, [payments, search, statusFilter]);

    const total = payments.length;
    const confirmedPayments = (payments as TPaymentWithRelations[]).filter((payment) => payment.paymentStatus === true).length;
    const pendingPayments = (payments as TPaymentWithRelations[]).filter((payment) => payment.paymentStatus === false).length;

    // const totalCompletedAmount = (payments as TPaymentWithRelations[]).filter((p) => p.paymentStatus === true).reduce((sum, p) => sum + p.amount, 0);
    // const totalPendingAmount = (payments as TPaymentWithRelations[]).filter((p) => p.paymentStatus === false).reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Payments
          </h1>
          <p className="text-slate-500 mt-1">
            Track all payment transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total" value={total} />
          <StatCard title="Confirmed" value={confirmedPayments} />
          <StatCard title="Cancelled" value={pendingPayments} />
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email or hostel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "confirmed" | "pending")
            }
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500">
              Loading payments...
            </p>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg font-medium">
                No payments found
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Paid By</th>
                  <th className="pb-3">Hostel Name</th>
                  <th className="pb-3">Room Number</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.paymentId}
                    className="border-b last:border-none"
                  >
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
                      ${Number(payment.amount).toLocaleString()}
                    </td>

                    <td className="py-4 text-slate-600">
                      {payment.method}
                    </td>

                    <td className="py-4">
                      <StatusBadge status={payment.paymentStatus} />
                    </td>

                    <td className="py-4 text-right space-x-2">
                      <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
                      }}
                      className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600">
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
      <UpdatePayment payment={selectedPayment} />
    </div>
    )
}

export default Payment;

/* ---------------- Reusable Components ---------------- */

const StatCard = ({
  title,
  value,
  color = "text-slate-900",
}: {
  title: string;
  value: string | number;
  color?: string;
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <p className="text-slate-500 text-sm">{title}</p>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: boolean }) => {
  const label = status ? "Confirmed" : "Cancelled";

  const styles = status
    ? "bg-emerald-100 text-emerald-700"
    : "bg-red-100 text-red-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
};