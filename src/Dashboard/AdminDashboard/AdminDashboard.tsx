import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Calendar,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";

interface User {
  id: string;
  role?: string;
  name?: string;
}

interface Hostel {
  id: string;
  name: string;
  landlord_name: string;
  status: string;
  images?: string[];
}

interface Booking {
  id: string;
  student_name: string;
  hostel_name: string;
  status: string;
  total_amount: number;
}

interface Payment {
  id: string;
  status: string;
  amount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: [] as User[],
    hostels: [] as Hostel[],
    bookings: [] as Booking[],
    payments: [] as Payment[],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 🔥 Replace with your real API calls
      const users: User[] = [];
      const hostels: Hostel[] = [];
      const bookings: Booking[] = [];
      const payments: Payment[] = [];

      setStats({ users, hostels, bookings, payments });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const students =
    stats.users.filter((u) => u.role === "student" || !u.role).length;

  const landlords =
    stats.users.filter((u) => u.role === "landlord").length;

  const pendingHostels =
    stats.hostels.filter((h) => h.status === "pending").length;

  const totalRevenue = stats.payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-slate-200 rounded mb-8 animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    Icon,
    color,
  }: {
    title: string;
    value: string | number;
    Icon: any;
    color: string;
  }) => (
    <div className="bg-white shadow-sm rounded-xl p-5 flex justify-between items-center">
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of your platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats.users.length}
            Icon={Users}
            color="indigo"
          />
          <StatCard
            title="Total Hostels"
            value={stats.hostels.length}
            Icon={Building2}
            color="emerald"
          />
          <StatCard
            title="Total Bookings"
            value={stats.bookings.length}
            Icon={Calendar}
            color="amber"
          />
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            Icon={CreditCard}
            color="purple"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl shadow-sm p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <p className="text-indigo-100">Students</p>
            <p className="text-3xl font-bold">{students}</p>
          </div>

          <div className="rounded-xl shadow-sm p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <p className="text-emerald-100">Landlords</p>
            <p className="text-3xl font-bold">{landlords}</p>
          </div>

          <div className="rounded-xl shadow-sm p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <p className="text-amber-100">Pending Approvals</p>
            <p className="text-3xl font-bold">{pendingHostels}</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white shadow-sm rounded-xl">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-semibold text-slate-900">
                Recent Bookings
              </h2>
              <Link to="/admin/bookings">
                <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="p-5">
              {stats.bookings.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {booking.student_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.hostel_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-1 rounded bg-slate-200">
                          {booking.status}
                        </span>
                        <p className="text-sm text-slate-500 mt-1">
                          ${booking.total_amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Hostels */}
          <div className="bg-white shadow-sm rounded-xl">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-semibold text-slate-900">
                Pending Approvals
              </h2>
              <Link to="/admin/hostels">
                <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                  Manage <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="p-5">
              {pendingHostels === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
                  <p>All hostels approved</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.hostels
                    .filter((h) => h.status === "pending")
                    .slice(0, 5)
                    .map((hostel) => (
                      <div
                        key={hostel.id}
                        className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {hostel.images?.[0] ? (
                            <img
                              src={hostel.images[0]}
                              alt={hostel.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {hostel.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {hostel.landlord_name}
                          </p>
                        </div>

                        <span className="flex items-center text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}