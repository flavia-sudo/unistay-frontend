import { Outlet } from "react-router-dom";
import AdminDrawer from "../AdminDashboard/aside/AdminDrawer";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function AdminLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 hidden md:block sticky top-0 left-0 h-screen">
        <AdminDrawer />
      </div>

      {/* Mobile Sidebar */}
      {drawerOpen &&(
        <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setDrawerOpen(false)}
        >
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 z-50">
                <AdminDrawer onClose={() => setDrawerOpen(false)}/>
            </div>
        </div>
        </>
      )}

      {/* Page Content */}
      <div className="flex-1 flex flex-col ml-4">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center bg-gray-900 text-white p-4">
            <button onClick={() => setDrawerOpen(true)} className="mr-4">
                <IoMenu size={24} />
            </button>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
    </div>
  );
}