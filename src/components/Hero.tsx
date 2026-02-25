import { ArrowRight, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
      
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920')] bg-cover bg-center opacity-20" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect Home, Anywhere
          </h1>

          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-xl">
            UniStay is your one-stop solution for finding the perfect home near campus.
          </p>

          {/* Quick Search */}
          <div className="flex flex-col md:flex-row items-stretch gap-3 mb-8 w-full md:w-auto">
            
            {/* Input with icon inside */}
            <div className="relative w-full md:w-1/2">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              
              <input
                type="text"
                placeholder="Search by location, property type, or price range"
                className="w-full pl-11 pr-4 py-3 rounded-lg text-gray-900 bg-amber-50
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Search button */}
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              <ArrowRight className="w-5 h-5" />
              <span>Search hostels</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;