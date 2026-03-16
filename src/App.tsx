import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import VerifyUser from "./pages/VerifyUser";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Message from "./pages/Message";
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

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="w-full grow">
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/verify' element={<VerifyUser/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/messages' element={<Message />} />
          <Route path='/admin' element={<AdminLayout />} >
          <Route index element={<AdminDashboard />} />
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='users' element={<Users />} />
            <Route path='hostels' element={< AllHostels />} />
            <Route path='bookings' element={<AllBookings />} />
            <Route path='payments' element={<Payment />} />
            <Route path='maintenance' element={<Maintenance />} />
            <Route path='reviews' element={<Review />} />
          </Route>
          <Route path='/dashboard' element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path='dashboard' element={<UserDashboard />} />
          <Route path='bookings' element={<UserBooking />} />
          </Route>
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App;