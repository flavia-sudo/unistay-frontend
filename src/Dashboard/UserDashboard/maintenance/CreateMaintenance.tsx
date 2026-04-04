import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { maintenanceAPI } from "../../../features/maintenanceAPI";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import { roomsAPI, type TRoom } from "../../../features/roomAPI";
// import { useState } from "react";

type CreateMaintenanceInputs = {
  hostelId: number;
  roomId: number;
  issueTitle: string;
  description: string;
  status: "pending" | "on progress" | "resolved";
};

const schema = yup.object({
  hostelId: yup.number().typeError("Hostel is required").required("Hostel is required"),
  roomId: yup.number().typeError("Room is required").required("Room is required"),
  issueTitle: yup.string().required("Issue title is required"),
  description: yup.string().required("Description is required"),
  status: yup.string().oneOf(["pending", "on progress", "resolved"]).required("Status is required"),
});

const CreateMaintenance = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateMaintenanceInputs>({
    resolver: yupResolver(schema),
    defaultValues: { status: "pending" },
  });

  // ✅ Redux instead of localStorage
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const [createMaintenance, { isLoading }] = maintenanceAPI.useCreateMaintenanceMutation();
  const { data: hostels = [] } = hostelsAPI.useGetHostelsQuery();
  const { data: allRooms = [] } = roomsAPI.useGetRoomsQuery();

  // ✅ Filter rooms by selected hostel so user can't pick a mismatched room
  const selectedHostelId = Number(watch("hostelId"));
  const filteredRooms = selectedHostelId
    ? allRooms.filter((r: TRoom) => r.hostelId === selectedHostelId)
    : [];

  const onSubmit: SubmitHandler<CreateMaintenanceInputs> = async (data) => {
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    try {
      const payload = {
        hostelId: Number(data.hostelId),
        roomId: Number(data.roomId),
        userId: Number(userId),
        issueTitle: data.issueTitle,
        description: data.description,
        status: data.status,
      };

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
    reset();
    (document.getElementById("create_modal") as HTMLDialogElement)?.close();
  };

  return (
    <dialog id="create_modal" className="fixed inset-0 z-50 bg-transparent">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Create Maintenance Request</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* HOSTEL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
            <select
              {...register("hostelId", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Hostel --</option>
              {hostels.map((hostel: THostel) => (
                <option key={hostel.hostelId} value={hostel.hostelId}>
                  {hostel.hostelName}
                </option>
              ))}
            </select>
            {errors.hostelId && <p className="text-red-500 text-xs mt-1">{errors.hostelId.message}</p>}
          </div>

          {/* ROOM — filtered by chosen hostel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <select
              {...register("roomId", { valueAsNumber: true })}
              disabled={!selectedHostelId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedHostelId ? "-- Select Room --" : "-- Select a hostel first --"}
              </option>
              {filteredRooms.map((room: TRoom) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.roomNumber}
                </option>
              ))}
            </select>
            {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId.message}</p>}
          </div>

          {/* ISSUE TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
            <input
              type="text"
              {...register("issueTitle")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Broken window"
            />
            {errors.issueTitle && <p className="text-red-500 text-xs mt-1">{errors.issueTitle.message}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe the issue in detail"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* STATUS */}
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
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60"
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