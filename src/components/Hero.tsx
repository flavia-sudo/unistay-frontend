import { ArrowRight } from "lucide-react";

const Hero = () => {
    return (
        <section className="w-full relative bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920')] bg-cover bg-center opacity-20">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-900/80 to-purple-900/60">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Find Your Perfect Home, Anywhere
                        </h1>
                        <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-xl">
                            UniStay is your one-stop solution for finding the perfect home near campus.
                        </p>
                        {/*Quick Search/Search Bar*/}
                        <div className="flex flex-col md:flex-row items-center mb-8">
                            <input
                                type="text"
                                placeholder="Search by location, property type, or price range"
                                className="w-full md:w-1/2 px-4 py-2 rounded-lg mr-4"
                            />
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg">
                                Search
                            </button>
                        </div>
                        <div className="flex items-center">
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center ml-4">
                                <ArrowRight className="mr-2" />
                                <span>Search hostels</span>
                            </button>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero