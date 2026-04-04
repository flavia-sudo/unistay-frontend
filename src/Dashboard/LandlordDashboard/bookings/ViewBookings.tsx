import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { Search, Calendar } from "lucide-react";
import { bookingsAPI, type TBooking } from "../../../features/bookingAPI";
import { hostelsAPI } from "../../../features/hostelAPI";

type TBookingWithRelations = TBooking & {
  firstName?: string;
  lastName?: string;
  hostelName?: string;
  roomNumber?: string;
};

const ViewBookings = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const { data: bookingsData = [], isLoading } =
    bookingsAPI.useGetBookingsQuery(undefined, {
      refetchOnMountOrArgChange: true,
      pollingInterval: 5000, // ✅ was 50000 — polls every 5s to catch payment→booking sync
    });

  const bookings: TBookingWithRelations[] = bookingsData;

  const { data: hostels = [] } = hostelsAPI.useGetHostelsQuery(undefined);

  const landlordHostels = useMemo(
    () => hostels.filter((h) => h.userId === userId),
    [hostels, userId]
  );

  const landlordHostelNames = useMemo(
    () => new Set(landlordHostels.map((h) => h.hostelName)),
    [landlordHostels]
  );

  const landlordBookings = useMemo(() => {
    if (!landlordHostelNames.size) return [];
    return bookings.filter((b) => landlordHostelNames.has(b.hostelName));
  }, [bookings, landlordHostelNames]);

  const [search, setSearch] = useState("");

  const filteredBookings = useMemo(() => {
    return landlordBookings.filter((booking) =>
      `${booking.firstName} ${booking.lastName} ${booking.hostelName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [landlordBookings, search]);

  return (
    <div className="w-full min-h-full bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-12 rounded-3xl">
          <h1 className="text-4xl font-bold">Booking Management</h1>
          <p className="text-indigo-100 mt-3">View bookings for your hostels</p>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          {isLoading ? (
            <p className="text-center text-slate-500">Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Calendar className="w-14 h-14 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No bookings found</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Check In</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId} className="border-b last:border-none">
                    <td className="py-4 font-medium">
                      {booking.firstName} {booking.lastName}
                    </td>
                    <td className="py-4">{booking.hostelName}</td>
                    <td className="py-4">{booking.roomNumber}</td>
                    <td className="py-4">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="py-4">{booking.duration ?? "—"}</td>
                    <td className="py-4 font-semibold">
                      Ksh {Number(booking.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.bookingStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.bookingStatus ? "Confirmed" : "Pending"}
                      </span>
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

export default ViewBookings;