import { Building2, Users, Calendar, CreditCard, Plus, ArrowRight } from "lucide-react";
import { MdWavingHand } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { hostelsAPI } from "../../features/hostelAPI";
import { roomsAPI } from "../../features/roomAPI";
import { bookingsAPI } from "../../features/bookingAPI";
import { paymentsAPI } from "../../features/paymentAPI";

const StatCard = ({
  label, value, icon, bg,
}: {
  label: string; value: string | number; icon: React.ReactNode; bg: string;
}) => (
  <div className="bg-white p-7 rounded-2xl shadow flex justify-between items-center">
    <div>
      <p className="text-gray-500">{label}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
    <div className={`${bg} p-4 rounded-xl`}>{icon}</div>
  </div>
);

const LandlordDashboard = () => {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.firstName ?? "Landlord";
  const landlordId = user?.userId;

  const { data: hostels = [] }  = hostelsAPI.useGetHostelsQuery();
  const { data: rooms = [] }    = roomsAPI.useGetRoomsQuery();
  const { data: bookings = [] } = bookingsAPI.useGetBookingsQuery(undefined, {
    skip: !landlordId,
    refetchOnMountOrArgChange: true,
  });
  const { data: payments = [] } = paymentsAPI.useGetPaymentsQuery(undefined, {
    skip: !landlordId,
    refetchOnMountOrArgChange: true,
  });

  // ✅ Filter all data down to only this landlord's scope
  const landlordHostels    = hostels.filter((h) => h.userId === landlordId);
  const landlordHostelIds  = new Set(landlordHostels.map((h) => h.hostelId));
  const landlordRooms      = rooms.filter((r) => landlordHostelIds.has(r.hostelId));
  const landlordRoomIds    = new Set(landlordRooms.map((r) => r.roomId));
  const landlordBookings   = bookings.filter((b) => landlordRoomIds.has(b.roomId));
  const landlordBookingIds = new Set(landlordBookings.map((b) => b.bookingId));
  const landlordPayments   = payments.filter((p) => landlordBookingIds.has(p.bookingId));

  // Stats
  const totalProperties = landlordHostels.length;
  const totalRooms      = landlordRooms.length;
  const availableRooms  = landlordRooms.filter((r) => Boolean(r.status)).length;
  const pendingBookings = landlordBookings.filter((b) => b.bookingStatus === false).length;
  const totalRevenue    = landlordPayments
    .filter((p) => p.paymentStatus === "Completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="flex-1 min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-teal-700 text-white px-10 py-14 rounded-3xl shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <p className="uppercase text-green-100 font-semibold mb-2">Landlord Portal</p>
            <h1 className="text-4xl font-bold">
              Welcome back, {firstName}
              <MdWavingHand className="inline ml-2 text-yellow-300" />
            </h1>
            <p className="text-green-100 mt-2">Here's what's happening with your properties</p>
          </div>

          {/* ✅ Fixed path: /landlord/hostel → /landlord/hostels */}
          <button
            onClick={() => navigate("/landlord/hostels")}
            className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-gray-100"
          >
            <Plus size={18} />
            Add Property
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard label="Total Properties" value={totalProperties}                    icon={<Building2 className="text-indigo-600" />} bg="bg-indigo-100" />
          <StatCard label="Available Rooms"  value={`${availableRooms}/${totalRooms}`}  icon={<Users className="text-green-600" />}     bg="bg-green-100"  />
          <StatCard label="Pending Bookings" value={pendingBookings}                    icon={<Calendar className="text-orange-600" />}  bg="bg-orange-100" />
          <StatCard label="Total Revenue"    value={`Ksh ${totalRevenue.toLocaleString()}`} icon={<CreditCard className="text-purple-600" />} bg="bg-purple-100" />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <Link to="/landlord/bookings" className="flex items-center gap-2 text-slate-600 hover:text-black">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          {landlordBookings.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <Calendar size={40} />
              <p className="mt-4">No bookings yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {landlordBookings.slice(0, 5).map((b) => (
                <div key={b.bookingId} className="py-3 flex justify-between text-sm text-slate-700">
                  <span>Booking #{b.bookingId}</span>
                  <span>{new Date(b.checkInDate).toLocaleDateString()}</span>
                  <span className={b.bookingStatus ? "text-green-600" : "text-amber-500"}>
                    {b.bookingStatus ? "Confirmed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Properties */}
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Properties</h2>
            <Link to="/landlord/hostels" className="flex items-center gap-2 text-slate-600 hover:text-black">
              Manage <ArrowRight size={18} />
            </Link>
          </div>

          {landlordHostels.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <Building2 size={40} />
              <p className="mt-4">No properties yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {landlordHostels.map((h) => (
                <div key={h.hostelId} className="border border-slate-200 rounded-xl p-4 flex gap-4 items-center">
                  <img src={h.image_URL} alt={h.hostelName} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-slate-800">{h.hostelName}</p>
                    <p className="text-sm text-slate-500">{h.location}</p>
                    <p className="text-sm text-green-600 font-medium">
                      Ksh {Number(h.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LandlordDashboard;