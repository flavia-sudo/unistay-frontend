import { Search, Calendar, MessageSquare, Building2, ChevronRight, Wrench } from "lucide-react";
import { MdWavingHand } from "react-icons/md"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { hostelsAPI, type THostel } from "../../features/hostelAPI";
import { roomsAPI, type TRoom } from "../../features/roomAPI";
import { bookingsAPI, type TBooking } from "../../features/bookingAPI";
import { paymentsAPI, type TPayment } from "../../features/paymentAPI";

type User = {
  firstName?: string;
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("User");

  const { data: hostelsData } = hostelsAPI.useGetHostelsQuery(undefined);
  const { data: roomsData } = roomsAPI.useGetRoomsQuery(undefined);
  const { data: bookingsData } = bookingsAPI.useGetBookingsQuery(undefined);
  const { data: paymentsData } = paymentsAPI.useGetPaymentsQuery(undefined);

  useEffect(() => {
  const storedUser = localStorage.getItem("Student");
  console.log("Raw stored user:", storedUser);

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed user:", parsedUser);
      if (parsedUser.firstName && typeof parsedUser.firstName === "string") {
        setFirstName(parsedUser.firstName);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
}, []);

  const hostels: THostel[] = hostelsData?.data || [];
  const rooms: TRoom[] = roomsData?.data || [];
  const bookings: TBooking[] = bookingsData?.data || [];
  const payments: TPayment[] = paymentsData?.data || [];

  const activeBookings = bookings.filter(b => b.bookingStatus === true).length;
  const pendingPayments = payments.filter(p => p.paymentStatus === false).length;
  const totalBookings = bookings.length;

  return (
    <div className="flex-1 min-h-screen bg-slate-50 pb-10">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-12 w-full rounded-3xl">

        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {firstName}
          <MdWavingHand className="inline-block ml-2" color="yellow" />
        </h1>

        <p className="text-indigo-100 mb-6">
          Find, book and manage your student accommodation.
        </p>

        <div className="flex gap-4 max-w-3xl">

          <div className="flex items-center bg-white rounded-lg px-4 py-3 w-full shadow">

            <Search className="text-gray-400 mr-3" size={20} />

            <input
              type="text"
              placeholder="Search hostels by name or city..."
              className="w-full outline-none text-gray-700"
            />

          </div>

          <button
            onClick={() => navigate("/dashboard/hostels")}
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg shadow"
          >
            All Hostels
          </button>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 -mt-6 mb-12">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Active Bookings</p>
          <h2 className="text-3xl font-bold text-green-600">{activeBookings}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Pending Payments</p>
          <h2 className="text-3xl font-bold text-orange-500">{pendingPayments}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Total Bookings</p>
          <h2 className="text-3xl font-bold">{totalBookings}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Unread Messages</p>
          <h2 className="text-3xl font-bold text-indigo-600">0</h2>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="px-8 mb-12">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-lg font-semibold mb-6">
            Quick Actions
          </h2>

          <div className="space-y-4">

            {/* Bookings */}
            <div
              onClick={() => navigate("/dashboard/bookings")}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-4">

                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Calendar className="text-indigo-600" size={22} />
                </div>

                <p className="font-medium">All My Bookings</p>

              </div>

              <ChevronRight className="text-gray-400" />

            </div>

            {/* Messages */}
            <div
              onClick={() => navigate("/messages")}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg"
            >

              <div className="flex items-center gap-4">

                <div className="bg-purple-100 p-3 rounded-lg">
                  <MessageSquare className="text-purple-600" size={22} />
                </div>

                <p className="font-medium">Messages</p>

              </div>

              <ChevronRight className="text-gray-400" />

            </div>

            {/* Maintenance */}
            <div
              onClick={() => navigate("/dashboard/hostels")}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg"
            >

              <div className="flex items-center gap-4">

                <div className="bg-green-100 p-3 rounded-lg">
                  <Wrench className="text-green-600" size={22} />
                </div>

                <p className="font-medium">Maintenance</p>

              </div>

              <ChevronRight className="text-gray-400" />

            </div>

          </div>

        </div>

      </div>

      {/* AVAILABLE HOSTELS */}
      <div className="px-10">

        <div className="flex items-center mb-6">
          <Building2 className="w-10 h-10 mr-6" />
          <h2 className="text-xl font-semibold">
            Available Hostels
          </h2>

          <button
            onClick={() => navigate("/dashboard/hostels")}
            className="text-indigo-600 font-medium hover:underline ml-auto"
          >
            See All →
          </button>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {hostels.slice(0, 3).map((hostel) => {

            const hostelRooms = rooms.filter(
              (room) => room.hostelId === hostel.hostelId
            );

            const lowestPrice =
              hostelRooms.length > 0
                ? Math.min(...hostelRooms.map((room) => Number(room.price)))
                : null;

            return (
              <div
                key={hostel.hostelId}
                className="bg-white rounded-12xl shadow-sm hover:shadow-lg transition-all 7duration-300 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/hostel/${hostel.hostelId}`)}
              >

                <img
                  src={hostel.image_URL}
                  alt={hostel.hostelName}
                  className="w-full h-40 object-cover rounded-t-xl"
                />

                <div className="p-4">

                  <h3 className="font-semibold text-lg">
                    {hostel.hostelName}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {hostel.location}
                  </p>

                  <p className="text-indigo-600 font-semibold mt-2">
                    {lowestPrice
                      ? `Ksh ${lowestPrice}/sem`
                      : "No rooms available"}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;