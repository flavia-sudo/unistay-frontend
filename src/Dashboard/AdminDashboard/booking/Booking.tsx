import { useMemo, useState } from "react";
import { Search, Calendar, Edit, Trash2 } from "lucide-react";
import { bookingsAPI, type TBooking } from "../../../features/bookingAPI";
import UpdateBooking from "./UpdateBooking";
import DeleteBooking from "./DeleteBooking";

type TBookingWithRelations = TBooking & {
  firstName?: string;
  lastName?: string;
  hostelName?: string;
  roomNumber?: string;
};

const AllBookings = () => {
  const { data: bookingsData, isLoading } =
    bookingsAPI.useGetBookingsQuery();

  const bookings = bookingsData || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled">("all");
  const [selectedBooking, setSelectedBooking] =
    useState<TBookingWithRelations | null>(null);

  // ---------------- FILTERING ----------------
  const filteredBookings = useMemo(() => {
    return (bookings as TBookingWithRelations[]).filter((booking) => {
      const searchLower = search.toLowerCase();

      const matchesSearch =
        booking.firstName?.toLowerCase().includes(searchLower) ||
        booking.lastName?.toLowerCase().includes(searchLower) ||
        booking.hostelName?.toLowerCase().includes(searchLower) ||
        booking.roomNumber?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && booking.bookingStatus === true) ||
        (statusFilter === "cancelled" && booking.bookingStatus === false);

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // ---------------- STATS ----------------
  const total = bookings.length;

  const confirmed = (bookings as TBookingWithRelations[]).filter(
    (b) => b.bookingStatus === true
  ).length;

  const cancelled = (bookings as TBookingWithRelations[]).filter(
    (b) => b.bookingStatus === false
  ).length;

  const revenue = (bookings as TBookingWithRelations[])
    .filter((b) => b.bookingStatus === true)
    .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            All Bookings
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of all hostel reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total" value={total} />
          <StatCard title="Confirmed" value={confirmed} color="text-emerald-600" />
          <StatCard title="Cancelled" value={cancelled} color="text-red-600" />
          <StatCard title="Revenue" value={`$${revenue.toLocaleString()}`} color="text-indigo-600" />
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, hostel or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "confirmed" | "cancelled")
            }
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table / Empty State */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500">Loading...</p>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Calendar className="w-14 h-14 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No bookings found</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">First Name</th>
                  <th className="pb-3">Last Name</th>
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId} className="border-b last:border-none">
                    <td className="py-4 font-medium text-slate-900">
                      {booking.firstName}
                    </td>
                    <td className="py-4 font-medium text-slate-900">
                      {booking.lastName}
                    </td>
                    <td className="py-4 text-slate-600">
                      {booking.hostelName}
                    </td>
                    <td className="py-4 text-slate-600">
                      {booking.roomNumber}
                    </td>
                    <td className="py-4 font-semibold">
                      ${Number(booking.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={booking.bookingStatus} />
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
                        }}
                        className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
                        }}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <UpdateBooking booking={selectedBooking} />
      <DeleteBooking booking={selectedBooking} />
    </div>
  );
};

export default AllBookings;

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