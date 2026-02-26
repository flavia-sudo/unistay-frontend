import { NavLink } from "react-router-dom"
import { adminDrawerData } from "./drawerData"
import { IoCloseSharp } from "react-icons/io5";

const AdminDrawer = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="p-4">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center text-white border-b-2 border-gray-700">
            Dashboard Menu
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
                        className="flex text-xl space-x-3 border-b-2 border-transparent hover:border-blue-400 text-gray-100 hover:bg-gray-700  m-2">
                        <item.icon />
                        <span className="text-xl text-gray-100">
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