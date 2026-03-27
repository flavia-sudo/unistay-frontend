import { MdWavingHand } from "react-icons/md"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, ArrowRight, Building2 } from "lucide-react";
import { hostelsAPI, type THostel } from "../../features/hostelAPI";
import { roomsAPI, type TRoom } from "../../features/roomAPI";
import { bookingsAPI, type TBooking } from "../../features/bookingAPI";
import { paymentsAPI, type TPayment } from "../../features/paymentAPI";

type User = {
  firstName?: string;
}
const LandlordDashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Landlord");

  const { data: hostelsData } = hostelsAPI.useGetHostelsQuery(undefined);
  const { data: roomsData } = roomsAPI.useGetRoomsQuery(undefined);
  const { data: bookingsData } = bookingsAPI.useGetBookingsQuery(undefined);
  const { data: paymentsData } = paymentsAPI.useGetPaymentsQuery(undefined);

  useEffect(() => {
    const storedUser = localStorage.getItem("Landlord");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
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

  const totalProperties = hostels.length;
  const totalRooms = rooms.length;
  const activeBookings = bookings.filter(b => b.bookingStatus === false).length;
  const totalRevenue = payments.filter(p => p.paymentStatus === true).reduce((acc, p) => acc + p.amount, 0);

  return (
    
  )
}

export default LandlordDashboard;
