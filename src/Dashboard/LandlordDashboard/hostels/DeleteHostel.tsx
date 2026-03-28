import { toast } from "sonner";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";

type DeleteHostelProps = {
  hostel: THostel | null;
};

const DeleteHostel = ({ hostel }: DeleteHostelProps) => {

  const [deleteHostel, { isLoading }] =
    hostelsAPI.useDeleteHostelMutation();

  const handleDelete = async () => {
    if (!hostel) {
      toast.error("No hostel selected");
      return;
    }

    try {
      await deleteHostel(hostel.hostelId).unwrap();

      toast.success("Hostel deleted successfully");

      (
        document.getElementById("delete_modal") as HTMLDialogElement
      )?.close();

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete hostel");
    }
  };

  const handleClose = () => {
    (
      document.getElementById("delete_modal") as HTMLDialogElement
    )?.close();
  };

  return (
    <dialog
      id="delete_modal"
      className="fixed inset-0 z-50 bg-transparent"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">

        <h3 className="text-xl font-bold mb-4">
          Delete Hostel
        </h3>

        {hostel && (
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <p>
              Are you sure you want to delete
              <span className="font-semibold"> {hostel.hostelName}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">

          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>

        </div>
      </div>
    </dialog>
  );
};

export default DeleteHostel;