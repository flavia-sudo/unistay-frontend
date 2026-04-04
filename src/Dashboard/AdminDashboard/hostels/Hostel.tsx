import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import DeleteHostel from "./DeleteHostel";

type THostelWithRelations = THostel & {
  firstName?: string;
  lastName?: string;
};

const AllHostels = () => {

  const { data: hostelsData = [], isLoading } =
    hostelsAPI.useGetHostelsQuery();

  const hostels = hostelsData as THostelWithRelations[];

  const [search, setSearch] = useState("");
  const [selectedHostel, setSelectedHostel] =
    useState<THostelWithRelations | null>(null);

  //Search by hostel name
  const filteredHostels = useMemo(() => {
    const searchLower = search.toLowerCase();

    return hostels.filter((hostel) => {
      return (
        hostel.hostelName?.toLowerCase().includes(searchLower));
    });
  }, [hostels, search]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-sm px-8 py-12">
          <h1 className="text-4xl font-bold text-slate-900">Hostels</h1>
          <p className="text-slate-900 mt-5">
            Manage your hostels
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by hostel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500">Loading...</p>
          ) : filteredHostels.length === 0 ? (
            <p className="text-center text-slate-500">
              No hostels found
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Image</th>
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">First Name</th>
                  <th className="pb-3">Last Name</th>
                  <th className="pb-3">Contact Number</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHostels.map((hostel) => (
                  <tr
                    key={hostel.hostelId}
                    className="border-b last:border-none"
                  >
                    <td className="py-4">
                      <img
                      src={hostel.image_URL}
                      alt={hostel.hostelName}
                      className="w-20 h-16 object-cover rounded-lg border"
                    />
                      </td>
                    <td className="py-4 font-medium text-slate-900">
                      {hostel.hostelName}
                    </td>

                    <td className="py-4 text-slate-700">
                      {hostel.firstName}
                    </td>

                    <td className="py-4 text-slate-700">
                      {hostel.lastName}
                    </td>

                    <td className="py-4 text-slate-700">
                      {hostel.contact_number}
                    </td>

                    <td className="py-4 text-slate-700">
                      {hostel.location}
                    </td>

                    <td className="py-4 text-right space-x-2">

                      <button
                        onClick={() => {
                          setSelectedHostel(hostel);
                          (
                            document.getElementById(
                              "delete_modal"
                            ) as HTMLDialogElement
                          )?.showModal();
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

      {/* Delete Modal */}
      <DeleteHostel hostel={selectedHostel} />
    </div>
  );
};

export default AllHostels;