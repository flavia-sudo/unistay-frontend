import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";

type TMaintenanceWithRelations = TMaintenance & {
  hostelName?: string;
  roomNumber?: string;
  firstName?: string;
  lastName?: string;
};

type UpdateMaintenanceProps = {
  maintenance: TMaintenanceWithRelations | null;
};

type UpdateMaintenanceInputs = {
  hostelId: number;
  roomId: number;
  userId: number;
  issueTitle: string;
  description: string;
  status: boolean;
};

const schema = yup.object({
  hostelId: yup.number().required("Hostel ID is required"),
  roomId: yup.number().required("Room ID is required"),
  userId: yup.number().required("User ID is required"),
  issueTitle: yup.string().required("Issue title is required"),
  description: yup.string().required("Description is required"),
  status: yup.boolean().required("Status is required"),
});

const UpdateMaintenance = ({ maintenance }: UpdateMaintenanceProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateMaintenanceInputs>({
    resolver: yupResolver(schema),
  });

  const [updateMaintenance, { isLoading }] =
    maintenanceAPI.useUpdateMaintenanceMutation();

  useEffect(() => {
    if (maintenance) {
      setValue("hostelId", maintenance.hostelId);
      setValue("roomId", maintenance.roomId);
      setValue("userId", maintenance.userId);
      setValue("issueTitle", maintenance.issueTitle);
      setValue("description", maintenance.description);
      setValue("status", maintenance.status);
    } else {
      reset();
    }
  }, [maintenance, reset, setValue]);

  const onSubmit: SubmitHandler<UpdateMaintenanceInputs> = async (data) => {
    try {
      if (!maintenance) {
        toast.error("No maintenance record selected for update.");
        return;
      }

      const response = await updateMaintenance({
        maintenanceId: maintenance.maintenanceId,
        ...data,
      });

      console.log("Maintenance updated successfully", response);
      toast.success("Maintenance updated successfully!");
      reset();
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating maintenance:", error);
      toast.error("Failed to update maintenance. Please try again.");
    }
  };

  const handleClose = () => {
    (document.getElementById("update_modal") as HTMLDialogElement)?.close();
  };

  return (
    <dialog id="update_modal" className="fixed inset-0 z-50 bg-transparent">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="font-bold text-xl mb-4 text-gray-800">
          Update Maintenance
        </h3>

        {maintenance && (
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm">
            <p>
              <span className="font-medium">Reported By:</span>{" "}
              {maintenance.firstName} {maintenance.lastName}
            </p>
            <p>
              <span className="font-medium">Hostel:</span>{" "}
              {maintenance.hostelName}
            </p>
            <p>
              <span className="font-medium">Room:</span>{" "}
              {maintenance.roomNumber}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hostel ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Hostel ID
            </label>
            <input
              type="number"
              {...register("hostelId")}
              className="input input-bordered w-full"
            />
            {errors.hostelId && (
              <p className="text-red-500 text-xs">
                {errors.hostelId.message}
              </p>
            )}
          </div>

          {/* Room ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Room ID
            </label>
            <input
              type="number"
              {...register("roomId")}
              className="input input-bordered w-full"
            />
            {errors.roomId && (
              <p className="text-red-500 text-xs">
                {errors.roomId.message}
              </p>
            )}
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Issue Title
            </label>
            <input
              type="text"
              {...register("issueTitle")}
              className="input input-bordered w-full"
            />
            {errors.issueTitle && (
              <p className="text-red-500 text-xs">
                {errors.issueTitle.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="textarea textarea-bordered w-full"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              {...register("status")}
              className="select select-bordered w-full"
            >
              <option value="false">Pending</option>
              <option value="true">Resolved</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {isLoading ? "Updating..." : "Update Maintenance"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateMaintenance;