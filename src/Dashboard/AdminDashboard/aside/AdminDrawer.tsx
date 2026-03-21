import { NavLink } from "react-router-dom"
import { adminDrawerData } from "./drawerData"
import { IoCloseSharp } from "react-icons/io5";

const AdminDrawer = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="h-full ww-72 shrink-0 bg-gray-900 text-white flex flex-col shadow-xl p-5">
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
        <ul className="flex flex-col gap-3 mt-4">
            {
                adminDrawerData.map((item) => (
                    <li key={item.id}>
                        <NavLink to={item.link}
                        className={({ isActive })=>
                        `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-500 text-white shadow"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}>
                        <div className="p-3 bg-gray-800 rounded-md">
                          <item.icon size={18} />
                        </div>
                        <span className="text-base font-semibold">
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