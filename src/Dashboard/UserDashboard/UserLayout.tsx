import { Outlet } from "react-router-dom";
import UserDrawer from "../UserDashboard/aside/UserDrawer";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function UserLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 hidden md:block shrink-0">
        <UserDrawer />
      </div>

      {/* Mobile Sidebar */}
      {drawerOpen &&(
        <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setDrawerOpen(false)}
        >
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 z-50">
                <UserDrawer onClose={() => setDrawerOpen(false)}/>
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
            <h1 className="text-lg font-bold">User Dashboard</h1>
        </div>
      <div className="flex-1 p-4 md:p-6">
        <Outlet />
      </div>
    </div>
    </div>
  );
}