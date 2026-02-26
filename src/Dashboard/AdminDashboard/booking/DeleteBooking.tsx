import { toast } from "sonner";
import { bookingsAPI, type TBooking } from "../../../features/bookingAPI";

type DeleteBookingProps = {
    booking: TBooking | null;
};

const DeleteBooking = ({ booking }: DeleteBookingProps) => {
    const [deleteBooking, { isLoading }] = bookingsAPI.useDeleteBookingMutation();

    const handleDelete = async () => {
        if (!booking) {
            toast.error("No booking selected for deletion");
            return;
        }

        try {
            await deleteBooking(booking.bookingId).unwrap();
            toast.success("Booking deleted successfully");
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error("Failed to delete booking");
        }
    };

    const handleClose = () => {
        (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    };

    return (
        <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-xl mb-2 text-gray-800">Delete Booking</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this booking?
                    This action cannot be undone.
                </p>
                <div className="modal-action">
                    <button type="button" className="btn" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-error" onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Delete Booking"}
                    </button>
                </div>
            </form>
        </dialog>
    );

};

export default DeleteBooking;