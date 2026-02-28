  import { usersAPI, type TUser } from "../../../features/userAPI";
  import { toast } from "sonner";

  type DeleteUserProps = {
    user: TUser | null;
  };

  const DeleteUser = ({ user }: DeleteUserProps) => {
    const [deleteUser] = usersAPI.useDeleteUserMutation();

    const handleDelete = async () => {
      if (!user) {
        toast.error("No user selected for deletion.");
        return;
      }
      try {
        await deleteUser(user.userId).unwrap();
        toast.success("User deleted successfully!");
        window.location.reload();
      } catch (error) {
        toast.error("Failed to delete user.");
      }
    };

    const handleClose = () => {
      ;(document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    };

    return (
      <dialog id="delete_modal" className="fixed inset-0 z-50 bg-transparent">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        ></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
          <h3 className="font-bold text-xl mb-2 text-gray-800">Delete User</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {user?.firstName} {user?.lastName}?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-2"
              onClick={() => { handleDelete(); handleClose(); }}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    );
}

export default DeleteUser;