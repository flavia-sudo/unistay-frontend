import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";

type TMaintenanceWithRelations = TMaintenance & {
  hostelName?: string;
  roomNumber?: string;
};

type CreateMaintenanceInputs = {
  hostelName: string;
  roomNumber: string;
  issueTitle: string;
  description: string;
  status: string;
};

const schema = yup.object({
  hostelName: yup.string().required("Hostel is required"),
  roomNumber: yup.string().required("Room number is required"),
  issueTitle: yup.string().required("Issue title is required"),
  description: yup.string().required("Description is required"),
  status: yup.string().required("Status is required"),
});

const CreateMaintenance = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMaintenanceInputs>({
    resolver: yupResolver(schema),
  });

  const user = localStorage.getItem("User");
  const userId = user ? JSON.parse(user).userId : null;

  const [createMaintenance, { isLoading }] = maintenanceAPI.useCreateMaintenanceMutation();

  const onSubmit: SubmitHandler<CreateMaintenanceInputs> = async (data) => {
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    try {
      const payload: TMaintenanceWithRelations = {
        ...data,
        status: data.status === "true",
        userId,
      } as unknown as TMaintenance;
      await createMaintenance(payload).unwrap();
      toast.success("Maintenance created successfully!");
      reset();
      (document.getElementById("create_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create maintenance. Please try again.");
    }
  };

  const handleClose = () => {
    (document.getElementById("create_modal") as HTMLDialogElement)?.close();
  };

  return (
    <dialog id="create_modal" className="fixed inset-0 z-50 bg-transparent">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Create Maintenance</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hostel Name */}
          <div className="form-control w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
            <input
              type="text"
              {...register("hostelName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.hostelName && (
              <p className="text-red-500 text-xs mt-1">{errors.hostelName.message}</p>
            )}
          </div>

          {/* Room Number */}
          <div className="form-control w-full">
            <label className="block text-sm font-medium xtext-gray-700mb-1">Room Number</label>
            <input
              type="text"
              {...register("roomNumber")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.roomNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.roomNumber.message}</p>
            )}
          </div>

          {/* Issue Title */}
          <div className="form-control w-full">
            <label className="block text-sm font-medium xtext-gray-700mb-1">Issue Title</label>
            <input
              type="text"
              {...register("issueTitle")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.issueTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.issueTitle.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-control w-full">
            <label className="block text-sm font-medium xtext-gray-700mb-1">Description</label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="form-control w-full">
            <label className="block text-sm font-medium xtext-gray-700mb-1">Status</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Resolved</option>
              <option value="false">Pending</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
            )}
          </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {isLoading ? "Creating..." : "Create Maintenance"}
              </button>
            </div>
        </form>
      </div>
    </dialog>
  );
};
 
export default CreateMaintenance;