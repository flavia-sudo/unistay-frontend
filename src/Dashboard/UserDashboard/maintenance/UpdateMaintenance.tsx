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
  issueTitle: string;
  description: string;
  status: "pending" | "on progress" | "resolved";
};

const schema = yup.object({
  issueTitle: yup.string().required("Issue title is required"),
  description: yup.string().required("Description is required"),
  status: yup
    .string()
    .oneOf(["pending", "on progress", "resolved"])
    .required("Status is required"),
});

const UpdateMaintenance = ({ maintenance }: UpdateMaintenanceProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateMaintenanceInputs>({
    resolver: yupResolver(schema),
    defaultValues: { status: "pending" },
  });

  const [updateMaintenance, { isLoading }] = maintenanceAPI.useUpdateMaintenanceMutation();

  useEffect(() => {
    if (maintenance) {
      reset({
        issueTitle: maintenance.issueTitle,
        description: maintenance.description,
        status: (maintenance.status as UpdateMaintenanceInputs["status"]) ?? "pending",
      });
    } else {
      reset({ status: "pending" });
    }
  }, [maintenance, reset]);

  const onSubmit: SubmitHandler<UpdateMaintenanceInputs> = async (data) => {
    if (!maintenance) {
      toast.error("No maintenance selected for update.");
      return;
    }

    try {
      await updateMaintenance({
        maintenanceId: maintenance.maintenanceId,
        hostelId: maintenance.hostelId,
        roomId: maintenance.roomId,
        ...data,
      }).unwrap();

      toast.success("Maintenance updated successfully!");
      reset({ status: "pending" });
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Update Maintenance</h3>

        {maintenance && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-sm space-y-1">
            <p>
              <span className="font-medium text-slate-700">Hostel:</span>{" "}
              <span className="text-slate-600">{maintenance.hostelName ?? "—"}</span>
            </p>
            <p>
              <span className="font-medium text-slate-700">Room:</span>{" "}
              <span className="text-slate-600">{maintenance.roomNumber ?? "—"}</span>
            </p>
            <div className="flex gap-6 pt-1">
              <p>
                <span className="font-medium text-slate-700">Hostel ID:</span>{" "}
                <span className="text-slate-500 font-mono">{maintenance.hostelId}</span>
              </p>
              <p>
                <span className="font-medium text-slate-700">Room ID:</span>{" "}
                <span className="text-slate-500 font-mono">{maintenance.roomId}</span>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
            <input
              type="text"
              {...register("issueTitle")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.issueTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.issueTitle.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="on progress">In Progress</option>
              <option value="resolved">Resolved</option>
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
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60"
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