import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store"; // ✅ matches your store.ts
import { Search, Building2, Edit, Trash2, Plus } from "lucide-react";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import CreateHostel from "./CreateHostel";
import UpdateHostel from "./UpdateHostel";
import DeleteHostel from "./DeleteHostel";

const ViewHostel = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId); // ✅ from Redux

  const { data: hostels = [], isLoading } = hostelsAPI.useGetHostelsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 50000,
  });

  const landlordHostels = useMemo(
    () => hostels.filter((h) => h.userId === userId),
    [hostels, userId]
  );

  const [search, setSearch] = useState("");
  const [selectedHostel, setSelectedHostel] = useState<THostel | null>(null);

  const filteredHostels = useMemo(
    () => landlordHostels.filter((h) =>
      h.hostelName.toLowerCase().includes(search.toLowerCase())
    ),
    [landlordHostels, search]
  );

  return (
    <div className="w-full min-h-full bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 bg-linear-to-r from-green-600 to-teal-600 text-white px-8 py-12 rounded-3xl flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">My Hostels</h1>
            <p className="text-green-100 mt-5 mb-4">Manage all your hostel properties</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => (document.getElementById("create_modal") as HTMLDialogElement)?.showModal()}
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-gray-100"
            >
              <Plus size={18} />
              Create Hostel
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hostel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          {isLoading ? (
            <p className="text-center text-slate-500">Loading hostels...</p>
          ) : filteredHostels.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Building2 className="w-14 h-14 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No hostels found</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHostels.map((hostel) => (
                  <tr key={hostel.hostelId} className="border-b last:border-none">
                    <td className="py-4 font-medium text-slate-700">{hostel.hostelName}</td>
                    <td className="py-4 text-slate-600">{hostel.location}</td>
                    <td className="py-4 text-slate-600">{hostel.contact_number}</td>
                    <td className="py-4 font-semibold">Ksh {Number(hostel.price).toLocaleString()}</td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedHostel(hostel);
                          (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
                        }}
                        className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedHostel(hostel);
                          (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
                        }}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODALS */}
      <CreateHostel hostel={null} />
      <UpdateHostel hostel={selectedHostel} />
      <DeleteHostel hostel={selectedHostel} />
    </div>
  ); 
};

export default ViewHostel;