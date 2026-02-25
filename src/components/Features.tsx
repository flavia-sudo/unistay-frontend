import { Search, Shield, MessageSquare, CreditCard, SlidersHorizontal } from "lucide-react";

const Features = () => {
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

        {/* AVAILABLE HOSTELS HEADER */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Available Hostels
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Find your ideal accommodation
          </p>
        </div>

        {/* SEARCH CONTAINER */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="flex items-center flex-1 bg-gray-100 rounded-xl px-4 py-3 w-full">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search hostels, locations..."
              className="bg-transparent outline-none ml-3 w-full text-gray-600 placeholder-gray-400"
            />
          </div>

          {/* Filters Button */}
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            <SlidersHorizontal size={18} />
            Filters
          </button>

          {/* Search Button */}
          <button className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;