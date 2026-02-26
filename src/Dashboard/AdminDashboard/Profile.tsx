import { Outlet } from "react-router"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import AdminDrawer from "./aside/AdminDrawer"
import { FaBars } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";

const AdminDashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const handleDrawerToggle = () => {
        setDrawerOpen((prev) => !prev)
    }
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex px-4 py-4 items-center">
                <button onClick={ handleDrawerToggle }
                className={`m-4 p-2 md:hidden rounded text-white transition-colors duration-300 ${
    drawerOpen ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-900"
  }`}>
                    {drawerOpen ? <IoCloseSharp size={26} /> : <FaBars size={20} />}
                </button>
                <span className="text-white text-lg font-semibold">
                    Welcome to your Admin dashboard
                </span>
            </div>
            <div className="flex flex-1 bg-gray-100">
                <aside className={`bg-base-200 w-64 p-4 transition-transform duration-300 ease-in-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static top-0 left-0 h-full z-50`}
                    style={{ minHeight: "100vh" }}
                >
                    <AdminDrawer onClose={() => setDrawerOpen(false)}/>
                </aside>
            <main className="flex-1 bg-blue-200 p-4 md:ml-64 min-h-screen">
                <Outlet />
            </main>
        </div>
        <Footer />
        </div>
    )
}

export default AdminDashboard