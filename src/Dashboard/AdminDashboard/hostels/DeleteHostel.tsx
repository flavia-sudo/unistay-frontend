import { toast } from "sonner";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";

type DeleteHostelProps = {
    hostel: THostel | null;
};

const DeleteHostel = ({ hostel }: DeleteHostelProps) => {
    const [deleteHostel, { isLoading }] = hostelsAPI.useDeleteHostelMutation();

    const handleDelete = async () => {
        if (!hostel) {
            toast.error("No hostel selected for deletion");
            return;
        }

        try {
            await deleteHostel(hostel.hostelId).unwrap();
            toast.success("Hostel deleted successfully");
        } catch (error) {
            console.error("Error deleting hostel:", error);
            toast.error("Failed to delete hostel");
        }
    };

    return (
        <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-xl mb-2 text-gray-800">Delete Hostel</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this hostel?
                    This action cannot be undone.
                </p>
                <div className="modal-action">
                    <button className="btn btn-error" onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                    <button className="btn">Cancel</button>
                </div>
            </form>
        </dialog>
    );
}

export default DeleteHostel;