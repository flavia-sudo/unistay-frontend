import { useState } from "react";
import { Search, Calendar, Building2, ChevronRight, Wrench } from "lucide-react";
import { MdWavingHand } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { hostelsAPI, type THostel } from "../../features/hostelAPI";
import { roomsAPI, type TRoom } from "../../features/roomAPI";
import { bookingsAPI, type TBooking } from "../../features/bookingAPI";
import { paymentsAPI, type TPayment } from "../../features/paymentAPI";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.firstName ?? "User";
  const userId = user?.userId;

  const { data: hostelsData } = hostelsAPI.useGetHostelsQuery();
  const { data: roomsData }   = roomsAPI.useGetRoomsQuery();

  const { data: bookingsData } = bookingsAPI.useGetBookingByUserIdQuery(userId!, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });
  const { data: paymentsData } = paymentsAPI.useGetPaymentByUserIdQuery(userId!, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const hostels: THostel[]   = hostelsData || [];
  const rooms: TRoom[]       = roomsData   || [];
  const bookings: TBooking[] = bookingsData || [];
  const payments: TPayment[] = paymentsData || [];

  // Stats — scoped to this user only (data already user-filtered from API)
  const activeBookings  = bookings.filter(b => b.bookingStatus === true).length;
  const pendingPayments = payments.filter(p => p.paymentStatus === "Pending").length;
  const totalBookings   = bookings.length;

  // ✅ Wire up search to filter the preview hostels
  const filteredHostels = hostels.filter(h =>
    h.hostelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/dashboard/hostels?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/dashboard/hostels");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-6 space-y-8">

      {/* ── HEADER ── */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 pt-12 pb-16 w-full rounded-3xl">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {firstName}
          <MdWavingHand className="inline-block ml-2" color="yellow" />
        </h1>
        <p className="text-indigo-100 mb-6">Find, book and manage your student accommodation.</p>

        <div className="flex gap-4 max-w-3xl">
          <div className="flex items-center bg-white rounded-lg px-4 py-3 w-full shadow">
            <Search className="text-gray-400 mr-3 shrink-0" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search hostels by name or city..."
              className="w-full outline-none text-gray-700 bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 ml-2 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow whitespace-nowrap transition-colors"
          >
            {searchQuery ? "Search" : "All Hostels"}
          </button>
        </div>
      </div>

      {/* ── STATS ── overlaps header with negative margin */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4 -mt-10">
        <StatCard
          label="Active Bookings"
          value={activeBookings}
          valueClass="text-green-600"
        />
        <StatCard
          label="Pending Payments"
          value={pendingPayments}
          valueClass="text-orange-500"
        />
        <StatCard
          label="Total Bookings"
          value={totalBookings}
          valueClass="text-slate-800"
        />
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickAction
              label="All My Bookings"
              icon={<Calendar className="text-indigo-600" size={22} />}
              iconBg="bg-indigo-100"
              onClick={() => navigate("/dashboard/bookings")}
            />
            <QuickAction
              label="Maintenance Requests"
              icon={<Wrench className="text-green-600" size={22} />}
              iconBg="bg-green-100"
              onClick={() => navigate("/dashboard/maintenance")}
            />
          </div>
        </div>
      </div>

      {/* ── AVAILABLE HOSTELS ── */}
      <div className="px-4">
        <div className="flex items-center mb-6">
          <Building2 className="w-8 h-8 mr-3 text-slate-700" />
          <h2 className="text-xl font-semibold">
            {searchQuery ? `Results for "${searchQuery}"` : "Available Hostels"}
          </h2>
          <button
            onClick={() => navigate("/dashboard/hostels")}
            className="text-indigo-600 font-medium hover:underline ml-auto"
          >
            See All →
          </button>
        </div>

        {filteredHostels.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <Building2 size={40} />
            <p className="mt-4">
              {searchQuery ? `No hostels found for "${searchQuery}"` : "No hostels available"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-indigo-600 hover:underline text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery ? filteredHostels : hostels.slice(0, 3)).map((hostel) => {
              const hostelRooms = rooms.filter(r => r.hostelId === hostel.hostelId);
              const lowestPrice = hostelRooms.length > 0
                ? Math.min(...hostelRooms.map(r => Number(r.price)))
                : null;

              return (
                <div
                  key={hostel.hostelId}
                  onClick={() => navigate(`/hostel/${hostel.hostelId}`)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  <div className="overflow-hidden h-40">
                    <img
                      src={hostel.image_URL}
                      alt={hostel.hostelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-slate-800">{hostel.hostelName}</h3>
                    <p className="text-gray-500 text-sm">{hostel.location}</p>
                    <p className="text-indigo-600 font-semibold mt-2">
                      {lowestPrice !== null ? `Ksh ${lowestPrice.toLocaleString()}/sem` : "No rooms available"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

// ── Reusable sub-components ──────────────────────────────────────────

const StatCard = ({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass: string;
}) => (
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-500 mb-2 text-sm">{label}</p>
    <h2 className={`text-3xl font-bold ${valueClass}`}>{value}</h2>
  </div>
);

const QuickAction = ({
  label,
  icon,
  iconBg,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
  >
    <div className="flex items-center gap-4">
      <div className={`${iconBg} p-3 rounded-lg`}>{icon}</div>
      <p className="font-medium text-slate-700">{label}</p>
    </div>
    <ChevronRight className="text-gray-400" />
  </div>
);

export default UserDashboard;