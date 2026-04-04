import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { paymentsAPI, type TPayment } from "../../../features/paymentAPI";
import { Search, Download, Loader2, CreditCard } from "lucide-react";
import jsPDF from "jspdf";

type TPaymentWithRelations = TPayment & {
  firstName?: string;
  lastName?: string;
  hostelName?: string;
  roomNumber?: string;
  transactionId?: string;
};

const UserPayment = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const { data: paymentsData, isLoading, error } =
    paymentsAPI.useGetPaymentByUserIdQuery(userId!, {
      skip: !userId,
      refetchOnMountOrArgChange: true,
      pollingInterval: 50000,
    });

  const payments: TPaymentWithRelations[] = paymentsData ?? [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Completed" | "Cancelled" | "Pending">("all");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        payment.hostelName?.toLowerCase().includes(searchLower) ||
        payment.roomNumber?.toLowerCase().includes(searchLower) ||
        payment.transactionId?.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === "all" || payment.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const completedList = payments.filter(p => p.paymentStatus === "Completed");
  const pendingList = payments.filter(p => p.paymentStatus === "Pending");
  const totalPaidAmount = completedList.reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const downloadReceipt = (payment: TPaymentWithRelations) => {
    const doc = new jsPDF();
    const date = new Date(payment.createdAt).toLocaleDateString();

    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text("OFFICIAL PAYMENT RECEIPT", 105, 20, { align: "center" });
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 25, 190, 25);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Receipt ID: REC-${payment.paymentId}`, 20, 40);
    doc.text(`Transaction Ref: ${payment.transactionId ?? "N/A"}`, 20, 50);
    doc.text(`Date: ${date}`, 20, 60);
    doc.setFontSize(14);
    doc.text("Student Details:", 20, 75);
    doc.setFontSize(12);
    doc.text(`Name: ${payment.firstName ?? ""} ${payment.lastName ?? ""}`, 30, 85);
    doc.setFontSize(14);
    doc.text("Accommodation Details:", 20, 100);
    doc.setFontSize(12);
    doc.text(`Hostel: ${payment.hostelName ?? "N/A"}`, 30, 110);
    doc.text(`Room Number: ${payment.roomNumber ?? "N/A"}`, 30, 120);
    doc.setFontSize(14);
    doc.text("Payment Summary:", 20, 135);
    doc.setFontSize(12);
    doc.text(`Method: ${payment.method}`, 30, 145);
    doc.text(`Status: ${payment.paymentStatus}`, 30, 155);
    doc.setFontSize(16);
    doc.text(`Total Amount: Ksh ${Number(payment.amount).toLocaleString()}`, 20, 175);
    doc.save(`Receipt_${payment.transactionId || payment.paymentId}.pdf`);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 bg-blue-700 text-white px-8 py-10 rounded-3xl shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Payment History</h1>
            <p className="mt-2 text-blue-100">Manage your hostel fees and download receipts</p>
          </div>
          <CreditCard size={48} className="opacity-20 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Invoices" value={payments.length} color="text-slate-700" />
          <StatCard title="Completed" value={completedList.length} color="text-emerald-600" />
          <StatCard title="Pending" value={pendingList.length} color="text-amber-600" />
          <StatCard title="Total Paid (Ksh)" value={totalPaidAmount.toLocaleString()} color="text-blue-600" />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Hostel, Room, or Transaction ID..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 outline-none min-w-45"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
            Failed to fetch payment data.
          </div>
        )}

        {!isLoading && filteredPayments.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Transaction ID</th>
                    <th className="px-6 py-4 font-semibold">Hostel</th>
                    <th className="px-6 py-4 font-semibold">Room Number</th>
                    <th className="px-6 py-4 font-semibold">Method</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.paymentId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{payment.transactionId}</td>
                      <td className="px-6 py-4 text-slate-800 font-medium">{payment.hostelName}</td>
                      <td className="px-6 py-4 text-slate-600">{payment.roomNumber}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{payment.method}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">Ksh {Number(payment.amount).toLocaleString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={payment.paymentStatus} /></td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => downloadReceipt(payment)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Download size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">No payment records found.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: TPayment["paymentStatus"] }) => {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default UserPayment;