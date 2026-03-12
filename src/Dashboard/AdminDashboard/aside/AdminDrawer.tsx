import { NavLink } from "react-router-dom"
import { adminDrawerData } from "./drawerData"
import { IoCloseSharp } from "react-icons/io5";

const AdminDrawer = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="h-full w-64 bg-gray-900 text-white flex flex-col shadow-xl p-4">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold tracking-wide text-white">
            Admin Panel
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-white hover:text-red-500"
            title="Close menu"
          >
            <IoCloseSharp size={24} />
          </button>
        )}
        </div>
        <ul className="flex flex-col gap-2">
            {
                adminDrawerData.map((item) => (
                    <li key={item.id}>
                        <NavLink to={item.link}
                        className={({ isActive })=>
                        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-500 text-white shadow"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}>
                        <div className="p-2 bg-gray-800 rounded-md">
                          <item.icon size={18} />
                        </div>
                        <span className="text-sm font-medium">
                        {item.name}
                        </span>
                        </NavLink>
                    </li>
                ))
            }
        </ul>
        </div>
  )
}

export default AdminDrawer