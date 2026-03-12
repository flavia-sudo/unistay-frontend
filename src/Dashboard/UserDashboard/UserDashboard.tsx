import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
//import { hostelsAPI } from "../../../features/hostelAPI";

const UserDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("User") || "{}");
  const firstName = user?.firstName || "User";

  return (
    <div className="w-full min-h-screen bg-gray-100">

      {/* Header */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-10">

        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {firstName}
        </h1>

        <p className="text-lg text-indigo-100 mb-8">
          Find, book and manage your student accommodation.
        </p>

        {/* Search Section */}
        <div className="flex gap-4 max-w-3xl">

          {/* Search Input */}
          <div className="flex items-center bg-white rounded-lg px-4 py-3 w-full shadow">

            <Search className="text-gray-400 mr-3" size={20} />

            <input
              type="text"
              placeholder="Search hostels by name or city..."
              className="w-full outline-none text-gray-700"
            />

          </div>

          {/* All Hostels Button */}
          <button
            onClick={() => navigate("/hostels")}
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg shadow"
          >
            All Hostels
          </button>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-10 -mt-10">

        {/* Active Bookings */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Active Bookings</p>
          <h2 className="text-3xl font-bold text-green-600">0</h2>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Pending Payments</p>
          <h2 className="text-3xl font-bold text-orange-500">0</h2>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Total Bookings</p>
          <h2 className="text-3xl font-bold text-black">0</h2>
        </div>

        {/* Unread Messages */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Unread Messages</p>
          <h2 className="text-3xl font-bold text-indigo-600">0</h2>
        </div>

      </div>

      {/* My Bookings Section */}
      <div className="px-10 mt-10">

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Bookings</h2>

            <button
              onClick={() => navigate("/bookings")}
              className="text-indigo-600 font-medium hover:underline"
            >
              View All →
            </button>
          </div>

          {/* Empty State */}
          <div className="text-gray-500 text-center py-10">
            You have no bookings yet.
          </div>

        </div>

      </div>

    </div>
  );
};

export default UserDashboard;