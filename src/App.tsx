// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import VerifyUser from "./pages/VerifyUser";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./Dashboard/AdminDashboard/AdminDashboard";
import Users from "./Dashboard/AdminDashboard/users/Users";
import AllHostels from "./Dashboard/AdminDashboard/hostels/Hostel";
import AllBookings from "./Dashboard/AdminDashboard/booking/Booking";
import Payment from "./Dashboard/AdminDashboard/payments/Payment";
import Maintenance from "./Dashboard/AdminDashboard/maintenance/Maintenance";
import Review from "./Dashboard/AdminDashboard/reviews/Review";
import AdminLayout from "./Dashboard/AdminDashboard/AdminLayout";
import UserLayout from "./Dashboard/UserDashboard/UserLayout";
import UserDashboard from "./Dashboard/UserDashboard/UserDashboard";
import UserBooking from "./Dashboard/UserDashboard/booking/UserBooking";
import Hostels from "./Dashboard/UserDashboard/hostels/ViewHostel";
import UserMaintenance from "./Dashboard/UserDashboard/maintenance/ViewMaintenance";
import UserReview from "./Dashboard/UserDashboard/reviews/UserReview";
import UserPayment from "./Dashboard/UserDashboard/payments/ViewPayment";
import LandlordLayout from "./Dashboard/LandlordDashboard/LandlordLayout";
import LandlordDashboard from "./Dashboard/LandlordDashboard/LandlordDasboard";
import ViewHostel from "./Dashboard/LandlordDashboard/hostels/ViewHostel";
import ViewBookings from "./Dashboard/LandlordDashboard/bookings/ViewBookings";
import ViewReview from "./Dashboard/LandlordDashboard/review/ViewReview";
import ProtectedRoute from "./ProtectedRoute";
import ViewUsers from "./Dashboard/LandlordDashboard/users/ViewUsers";
import ViewPayment from "./Dashboard/LandlordDashboard/payment/Payment";
import MaintenanceLandlord from "./Dashboard/LandlordDashboard/maintenance/ViewMaintenace";

// Guard: block landlords from /hostels
const HostelsBrowseRoute = () => {
  const role = useSelector((state: RootState) => state.auth.user?.role?.toLowerCase());
  if (role === "landlord") return <Navigate to="/landlord" replace />;
  return <Hostels />;
};

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="w-full grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyUser />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Landlords are redirected away from /hostels */}
          <Route path="/hostels" element={<HostelsBrowseRoute />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="hostels" element={<AllHostels />} />
            <Route path="bookings" element={<AllBookings />} />
            <Route path="payments" element={<Payment />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="review" element={<Review />} />
          </Route>

          {/* Student dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="bookings" element={<UserBooking />} />
            <Route path="hostels" element={<Hostels />} />
            <Route path="maintenance" element={<UserMaintenance />} />
            <Route path="reviews" element={<UserReview />} />
            <Route path="payments" element={<UserPayment />} />
          </Route>

          {/* Landlord dashboard routes */}
          <Route
            path="/landlord"
            element={
              <ProtectedRoute allowedRoles={["landlord"]}>
                <LandlordLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<LandlordDashboard />} />
            <Route path="dashboard" element={<LandlordDashboard />} />
            <Route path="users" element={<ViewUsers />} />
            <Route path="hostels" element={<ViewHostel />} />
            <Route path="bookings" element={<ViewBookings />} />
            <Route path="payments" element={<ViewPayment />} />
            <Route path="maintenance" element={<MaintenanceLandlord />} />
            <Route path="review" element={<ViewReview />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;