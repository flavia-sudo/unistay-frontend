import { toast } from "sonner";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";

type DeleteHostelProps = {
    hostel: THostel | null;
};

const DeleteHostel = ({ hostel }: DeleteHostelProps) => {
    const [deleteHostel, { isLoading }] = hostelsAPI.useDeleteHostelMutation();

    const handleDelete = async () => {
        try {
        if (!hostel) {
            toast.error("No hostel selected for deletion");
            return;
        }
        const response =await deleteHostel(hostel.hostelId);
        console.log("Hostel deleted successfully", response);
        toast.success("Hostel deleted successfully!");
        } catch (error) {
            console.error("Error deleting hostel:", error);
            toast.error("Failed to delete hostel");
        }
    };

    const handleClose = () => {
        (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    };

    return (
    <dialog id="delete_modal" className="fixed inset-0 z-50 bg-transparent">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="font-bold text-xl mb-2 text-gray-800">Delete Hostel</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this hostel?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Hostel'}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default DeleteHostel;