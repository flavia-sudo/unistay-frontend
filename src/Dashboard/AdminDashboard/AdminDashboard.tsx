import { Link } from "react-router-dom";
import { MdWavingHand } from "react-icons/md"
import {
  Users,
  Calendar,
  CreditCard,
  ArrowRight,
  Building2,
  Toolbox,
  PenLine,
} from "lucide-react";
import { usersAPI } from "../../features/userAPI";
import { hostelsAPI } from "../../features/hostelAPI";
import { bookingsAPI } from "../../features/bookingAPI";
import { paymentsAPI } from "../../features/paymentAPI";
import { maintenanceAPI } from "../../features/maintenanceAPI";
import { reviewsAPI } from "../../features/reviewAPI";

export default function AdminDashboard() {
  const { data: usersData, isLoading: usersLoading } = usersAPI.useGetUsersQuery();
  const { data: hostelsData, isLoading: hostelsLoading } = hostelsAPI.useGetHostelsQuery();
  const { data: bookingsData, isLoading: bookingsLoading } = bookingsAPI.useGetBookingsQuery();
  const { data: paymentsData, isLoading: paymentsLoading } = paymentsAPI.useGetPaymentsQuery();
  const { data: maintenanceData, isLoading: maintenanceLoading } = maintenanceAPI.useGetMaintenancesQuery();
  const { data: reviewsData, isLoading: reviewsLoading } = reviewsAPI.useGetReviewsQuery();

  const loading = 
    usersLoading ||
    hostelsLoading ||
    bookingsLoading ||
    paymentsLoading ||
    maintenanceLoading ||
    reviewsLoading;

    const users = usersData || [];
    const hostels = Array.isArray(hostelsData) ? hostelsData : hostelsData ?? [];
    const bookings = bookingsData || [];
    const payments = paymentsData || [];
    const maintenance = maintenanceData || [];
    const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData || [];


 const students =
  users.filter((u: any) => (u.role || u.user_type || "").toLowerCase() === "student").length;

const landlords =
  users.filter((u: any) => (u.role || u.user_type || "").toLowerCase() === "landlord").length;

const admins =
  users.filter((u: any) => (u.role || u.user_type || "").toLowerCase() === "admin").length;

const pendingMaintenance =
  maintenance.filter((m: any) => (m.status || "").toLowerCase() === "pending").length;

const totalRevenue = payments
  .filter((p: any) => (p.paymentStatus || "").toLowerCase() === "completed")
  .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

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
    <div className="flex-1 min-h-screen bg-slate-50 pb-10">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-12 w-full rounded-3xl ">
          <h1 className="text-4xl mb-2 font-bold">
            Welcome back, Admin
            <MdWavingHand className="inline-block ml-2" color="yellow" />
          </h1>
          <p className="text-indigo-100 mt-6">
            Overview of your platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={users.length}
            Icon={Users}
            color="indigo"
          />
          <StatCard
            title="Total Hostels"
            value={hostels.length}
            Icon={Building2}
            color="emerald"
          />
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            Icon={Calendar}
            color="amber"
          />
          <StatCard
            title="Total Revenue"
            value={`Ksh ${totalRevenue.toLocaleString()}`}
            Icon={CreditCard}
            color="purple"
          />
          <StatCard
            title="Maintenance"
            value={pendingMaintenance}
            Icon={Toolbox}
            color="rose"
          />
          <StatCard
            title="Total Reviews"
            value={reviews.length}
            Icon={PenLine}
            color="cyan"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl shadow-sm p-6 bg-linear-to-br from-indigo-500 to-purple-600 text-white">
            <p className="text-indigo-100">Students</p>
            <p className="text-3xl font-bold">{students}</p>
          </div>

          <div className="rounded-xl shadow-sm p-6 bg-linear-to-br from-emerald-500 to-teal-600 text-white">
            <p className="text-emerald-100">Landlords</p>
            <p className="text-3xl font-bold">{landlords}</p>
          </div>

          <div className="rounded-xl shadow-sm p-6 bg-linear-to-br from-amber-500 to-orange-600 text-white">
            <p className="text-amber-100">Admins</p>
            <p className="text-3xl font-bold">{admins}</p>
          </div>
        </div>

        {/* Bottom Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        
        {/* Bookings */}
        <Link to="/admin/bookings">
          <div className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900">Bookings</h3>
            <p className="text-sm text-slate-500 mt-1">
              Manage all bookings
            </p>
          </div>
        </Link>

        {/* Hostels */}
        <Link to="/admin/hostels">
          <div className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Building2 className="w-6 h-6 text-emerald-600" />
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900">Hostels</h3>
            <p className="text-sm text-slate-500 mt-1">
              View and manage hostels
            </p>
          </div>
        </Link>

        {/* Maintenance */}
        <Link to="/admin/maintenance">
          <div className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Toolbox className="w-6 h-6 text-amber-600" />
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900">Maintenance</h3>
            <p className="text-sm text-slate-500 mt-1">
              Handle maintenance requests
            </p>
          </div>
        </Link>

        {/* Reviews */}
        <Link to="/admin/review">
          <div className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <PenLine className="w-6 h-6 text-purple-600" />
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900">Reviews</h3>
            <p className="text-sm text-slate-500 mt-1">
              View user feedback
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}