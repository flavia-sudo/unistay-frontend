import { toast } from "sonner";
import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";

type DeleteMaintenanceProps = {
    maintenance: TMaintenance | null;
};

const DeleteMaintenance = ({ maintenance }: DeleteMaintenanceProps) => {
    const [deleteMaintenance, { isLoading }] = maintenanceAPI.useDeleteMaintenanceMutation();

    const handleDelete = async () => {
        try {
            if (!maintenance) {
                toast.error("No maintenance selected for deletion.");
                return;
            }

            const response = await deleteMaintenance(maintenance.maintenanceId);
            console.log("Maintenance deleted successfully", response);
            toast.success("Maintenance deleted successfully!");
        } catch (error) {
            console.error("Error deleting maintenance:", error);
            toast.error("Failed to delete maintenance");
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
            <h3 className="font-bold text-xl mb-2 text-gray-800">Delete Maintenance</h3>
            <p className="text-gray-600 mb-6">
            Are you sure you want to delete this maintenance?
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
                onClick={() => {
                handleDelete();
                handleClose();
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Deleting...' : 'Delete Maintenance'}
            </button>
            </div>
        </div>
       </dialog>
    );
}

export default DeleteMaintenance;