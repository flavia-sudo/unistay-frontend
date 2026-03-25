import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { maintenanceAPI, type TMaintenance } from "../../../features/maintenanceAPI";

type TMaintenanceWithRelations = TMaintenance & {
  hostelName?: string;
  roomNumber?: string;
};

type UpdateMaintenanceProps = {
  maintenance: TMaintenanceWithRelations | null;
};

type UpdateMaintenanceInputs = {
  status: string;
};

const schema = yup.object({
  status: yup.string().required("Status is required"),
});

const UpdateMaintenance = ({ maintenance }: UpdateMaintenanceProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateMaintenanceInputs>({
    resolver: yupResolver(schema),
  });

  const [updateMaintenance, { isLoading }] = maintenanceAPI.useUpdateMaintenanceMutation();

  useEffect(() => {
    if (maintenance) {
      setValue("status", maintenance.status);
    } else {
      reset();
    }
  }, [maintenance, reset, setValue]);

  const onSubmit: SubmitHandler<UpdateMaintenanceInputs> = async (data) => {
    try {
      if (!maintenance) {
        toast.error("No maintenance selected for update.");
        return;
      }

      await updateMaintenance({
        maintenanceId: maintenance.maintenanceId,
        status: data.status,
      }).unwrap();

      toast.success("Maintenance status updated!");
      reset();
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error(error);
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
        <h3 className="font-bold text-xl mb-4 text-gray-800">Update Maintenance</h3>

        {maintenance && (
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm">
            <p><span className="font-medium">Hostel:</span> {maintenance.hostelName}</p>
            <p><span className="font-medium">Room:</span> {maintenance.roomNumber}</p>
            <p><span className="font-medium">Issue:</span> {maintenance.issueTitle}</p>
            <p><span className="font-medium">Description:</span> {maintenance.description}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Status select */}
          <div className="form-control w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="on progress">On Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Buttons */}
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
              {isLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateMaintenance;