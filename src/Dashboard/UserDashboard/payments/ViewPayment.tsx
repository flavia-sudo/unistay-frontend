import { useState } from "react";
import { paymentsAPI, type TPayment } from "../../../features/paymentAPI";
import { useMemo } from "react";
import { Search, Download } from "lucide-react";
import jsPDF from "jspdf";

type TPaymentWithRelations = TPayment & {
    firstName?: string;
    lastName?: string;
    hostelName?: string;
    roomNumber?: string;
};

const UserPayment = () => {
    const storedUser = localStorage.getItem("Student");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.userId;

    const { data: paymentsData,
        isLoading: paymentsLoading,
        error: paymentsError,
    } = paymentsAPI.useGetPaymentByUserIdQuery(userId!, {
        skip: !userId,
        refetchOnMountOrArgChange: true,
        pollingInterval: 50000,
    });
    const payments: TPaymentWithRelations[] = paymentsData?. data ?? [];

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
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
    const confirmedPayments = payments.filter((payment) => payment.paymentStatus === true).length;
    const pendingPayments = payments.filter((payment) => payment.paymentStatus === false).length;
    const revenue = payments.reduce((acc, payment) => acc + payment.amount, 0);

    const downloadReceipt = (payment: TPaymentWithRelations) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Payment Receipt", 20, 20);

        doc.setFontSize(12);
        doc.text(`Name: ${payment.firstName} ${payment.lastName}`, 20, 40);
        doc.text(`Hostel: ${payment.hostelName}`, 20, 50);
        doc.text(`Room: ${payment.roomNumber}`, 20, 60);
        doc.text(`Amount: Ksh ${payment.amount}`, 20, 70);
        doc.text(`Method: ${payment.method}`, 20, 80);
        doc.text(
            `Status: ${payment.paymentStatus ? "Confirmed" : "Pending"}`,
            20,
            90
        );

        doc.save("payment_receipt.pdf");
    };

    return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-8 py-12 w-full rounded-3xl">
          <h1 className="text-4xl font-bold text-slate-900">
            My Payments
          </h1>
          <p className="text-slate-700 mt-5">
            View and download your payment history
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total"
            value={total}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Confirmed"
            value={confirmedPayments}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
          />
          <StatCard
            title="Pending"
            value={pendingPayments}
            color="text-rose-600"
            bgColor="bg-rose-100"
          />
          <StatCard
            title="Paid"
            value={`Ksh ${revenue.toLocaleString()}`}
            color="text-sky-600"
            bgColor="bg-sky-100"
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hostel or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "confirmed" | "pending"
              )
            }
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        {/* Table */}
        {paymentsLoading && <p className="text-center text-slate-500">Loading payments...</p>}
        {paymentsError && <p className="text-red-600">Error loading payments</p>}
        
        {payments.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Download</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.paymentId}
                    className="border-b last:border-none"
                  >
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

                    <td className="py-4">
                      <button
                        onClick={() => downloadReceipt(payment)}
                        className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        ) : (
            !paymentsLoading && (<p className="text-center text-slate-500 text-base">No payments found</p>
        )
    )}
    </div>
    </div>
    );
};

export default UserPayment;

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
    <p className={`text-2xl font-bold mt-2 ${color}`}>
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status }: { status: boolean }) => {
  const label = status ? "Confirmed" : "Pending";

  const styles = status
    ? "bg-emerald-100 text-emerald-700"
    : "bg-red-100 text-red-700";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
};
