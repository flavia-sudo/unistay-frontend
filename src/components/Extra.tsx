import { ArrowRight } from "lucide-react";

const Extra = () => {
  return (
    <section className="w-full py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
      <div className="max-w-5xl mx-auto px-6 text-center text-white">
        
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Are You a Property Owner?
        </h2>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/90 mb-12">
          List your hostel on UniStay and reach thousands of students 
          looking for accommodation.
        </p>

        {/* CTA Button */}
        <button className="inline-flex items-center gap-3 bg-white text-indigo-600 font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
          List Your Property
          <ArrowRight size={20} />
        </button>

      </div>
    </section>
  );
};

export default Extra;