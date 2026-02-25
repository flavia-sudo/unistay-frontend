import { useState } from "react";
import {
  Search,
  Shield,
  MessageSquare,
  CreditCard,
  SlidersHorizontal,
} from "lucide-react";

const Features = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [roomType, setRoomType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  const hostels = [
    { id: 1, name: "Riverside Hostels", location: "Lowlands", type: "One bedroom", price: 30000 },
    { id: 2, name: "Campus View Hostels", location: "Ndagani", type: "Bedsitter", price: 22000 },
    { id: 3, name: "Green Valley Hostels", location: "Ndagani", type: "Bedsitter", price: 24000 },
    { id: 4, name: "MamboLeo Hostels", location: "Slaughter", type: "Bedsitter", price: 20000 },
    { id: 5, name: "Mordern Hostels", location: "Mungoni", type: "Bedsitter", price: 26000 },
    { id: 6, name: "Executive Hostels", location: "Ndagani", type: "Bedsitter", price: 20000 },
  ];

  const features = [
    {
      icon: <Search size={28} />,
      title: "Easy Search",
      desc: "Find the perfect hostel with powerful filters",
    },
    {
      icon: <Shield size={28} />,
      title: "Verified Listings",
      desc: "All properties are verified for your safety",
    },
    {
      icon: <MessageSquare size={28} />,
      title: "Direct Chat",
      desc: "Chat directly with landlords",
    },
    {
      icon: <CreditCard size={28} />,
      title: "Secure Payments",
      desc: "Book and pay securely online",
    },
  ];

  const filteredHostels = hostels.filter((hostel) => {
    const matchesSearch =
      hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      roomType === "All" || hostel.type === roomType;

    const matchesPrice =
      maxPrice === "" || hostel.price <= Number(maxPrice);

    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <section className="bg-gray-100 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Available Hostels
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Find your ideal accommodation
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
          
          {/* Input */}
          <div className="flex items-center flex-1 bg-gray-100 rounded-xl px-4 py-3 w-full">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hostels, locations..."
              className="bg-transparent outline-none ml-3 w-full text-gray-600 placeholder-gray-400"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          {/* Search Button */}
          <button
            onClick={() => {}}
            className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition"
          >
            Search
          </button>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div className="bg-white mt-4 p-6 rounded-2xl shadow-sm grid md:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="All">All</option>
                <option value="Single">Single</option>
                <option value="Bedsitter">Bedsitter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Price (Ksh)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 20000"
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setRoomType("All");
                  setMaxPrice("");
                }}
                className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostels.length > 0 ? (
            filteredHostels.map((hostel) => (
              <div
                key={hostel.id}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {hostel.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {hostel.location}
                </p>
                <p className="mt-2 text-indigo-600 font-semibold">
                  Ksh {hostel.price}
                </p>
                <span className="text-xs text-gray-400">
                  {hostel.type}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hostels found.</p>
          )}
        </div>

      </div>
    </section>
  );
};

export default Features;