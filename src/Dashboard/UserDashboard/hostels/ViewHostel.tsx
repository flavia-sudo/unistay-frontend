import { useMemo, useState } from "react";
import { Search, MapPin, Wifi, Car, Utensils } from "lucide-react";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import { roomsAPI, type TRoom } from "../../../features/roomAPI";
import { useNavigate } from "react-router-dom";
import greenValleyImg from "../../../assets/images/victor-birai-GmXr5dNL3YI-unsplash.jpg";

type THostelWithRelations = THostel & {
  firstName?: string;
  lastName?: string;
  contact_number?: string;
};

const Hostels = () => {
  const navigate = useNavigate();

  const { data: hostelsData = [], isLoading } =
    hostelsAPI.useGetHostelsQuery();

  const { data: roomsData = [] } = roomsAPI.useGetRoomsQuery();

  const hostels = hostelsData as THostelWithRelations[];

  const rooms = roomsData as TRoom[];

  const [search, setSearch] = useState("");

  const filteredHostels = useMemo(() => {
    const searchLower = search.toLowerCase();

    return hostels.filter((hostel) =>
      hostel.hostelName?.toLowerCase().includes(searchLower)
    );
  }, [hostels, search]);

  return (
    <section className="w-full min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl px-8 py-12 text-white">
          <h1 className="text-4xl font-bold">
            Available Hostels
          </h1>
          <p className="mt-4 text-lg">
            Find the perfect hostel for your stay <br />
            Home Away From Home
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-10">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18}/>
            <input
              type="text"
              placeholder="Search hostels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Cards */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredHostels.length === 0 ? (
          <p className="text-center text-gray-500">
            No hostels found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {filteredHostels.map((hostel) => (
              <div
                key={hostel.hostelId}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >

                {/* Image */}
                <div className="relative">
                  <img
                    src={greenValleyImg}
                    alt={hostel.hostelName}
                    className="w-full h-72 object-cover"
                  />

                  {/* Rooms badge */}
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
                    {hostel.rooms_available || 8} rooms available
                  </div>

                  {/* Price badge */}
                  <div className="absolute bottom-4 right-4 bg-white text-purple-700 font-bold text-xl px-5 py-2 rounded-xl shadow-lg">
                    Ksh {rooms.price || 24000}
                    <span className="text-sm text-gray-500 font-medium">
                      /sem
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">

                  {/* Name + Rating */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {hostel.hostelName}
                    </h3>

                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mt-3 text-gray-600">
                    <MapPin size={18} />
                    <span>{hostel.location}</span>
                  </div>

                  {/* Owner */}
                  <p className="text-gray-500 mt-1 text-sm">
                    Owner: {hostel.firstName} {hostel.lastName}
                  </p>
                  <p className="text-gray-500 mt-1 text-sm">
                    Contact number: {hostel.contact_number}
                  </p>

                  <hr className="my-4 border-gray-200" />

                  {/* Amenities */}
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Wifi size={18} />
                    </div>
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Car size={18} />
                    </div>
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Utensils size={18} />
                    </div>

                    <span className="text-sm text-gray-500">
                      +2 more
                    </span>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() =>
                      navigate(`/book/${hostel.hostelId}`)
                    }
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Book Now
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
};

export default Hostels;