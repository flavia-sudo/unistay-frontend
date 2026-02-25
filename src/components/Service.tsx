import { Star, MapPin, Wifi, Car, Utensils } from "lucide-react";
import greenValleyImg from "../assets/images/victor-birai-GmXr5dNL3YI-unsplash.jpg";
import mamboLeoImg from "../assets/images/Screenshot 2026-02-25 171520.png";
import riverSideImg from "../assets/images/michael-ali-_4FYGcptcSY-unsplash.jpg";
import mordernImg from "../assets/images/Screenshot 2026-02-25 175004.png";
import executiveImg from "../assets/images/Screenshot 2026-02-25 171529.png";
import campusImg from "../assets/images/Screenshot 2026-02-25 175154.png";

const Services = () => {
  const properties = [
    {
      name: "Riverside Hostels",
      address: "Lowlands",
      type: "One bedroom",
      price: 30000,
      rating: 4.9,
      roomsAvailable: 2,
      image:
        riverSideImg,
    },
    {
      name: "Campus View Hostels",
      address: "Ndagani",
      type: "Bedsitter",
      price: 22000,
      rating: 4.8,
      roomsAvailable: 12,
      image:
        campusImg,
    },
    {
      name: "Green Valley Hostels",
      address: "Ndagani",
      type: "Bedsitter",
      price: 24000,
      rating: 4,
      roomsAvailable: 1,
      image:
        greenValleyImg,
    },
    {
      name: "MamboLeo Hostels",
      address: "Slaughter",
      type: "Bedsitter",
      price: 20000,
      rating: 4.4,
      roomsAvailable: 3,
      image:
        mamboLeoImg,
    },
    {
      name: "Mordern Hostels",
      address: "Mungoni",
      type: "Bedsitter",
      price: 26000,
      rating: 4.9,
      roomsAvailable: 10,
      image:
        mordernImg,
    },
    {
      name: "Executive Hostels",
      address: "Ndagani",
      type: "Bedsitter",
      price: 20000,
      rating: 4.9,
      roomsAvailable: 3,
      image:
        executiveImg,
    },
  ];

  return (
    <section className="w-full py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {properties.map((property, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-72 object-cover"
                />

                {/* Rooms Available Badge */}
                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
                  {property.roomsAvailable} rooms available
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-4 right-4 bg-white text-purple-700 font-bold text-xl px-5 py-2 rounded-xl shadow-lg">
                  Ksh {property.price}
                  <span className="text-sm font-medium text-gray-500">
                    /sem
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title + Rating */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {property.name}
                  </h3>

                  <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                    <Star size={18} fill="currentColor" />
                    <span className="text-gray-800">
                      {property.rating}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-2 mt-3 text-gray-600">
                  <MapPin size={18} />
                  <span>{property.address}</span>
                </div>

                {/* Room Type */}
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <span>{property.type}</span>
                </div>

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

                  <span className="text-sm text-gray-500">+2 more</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;