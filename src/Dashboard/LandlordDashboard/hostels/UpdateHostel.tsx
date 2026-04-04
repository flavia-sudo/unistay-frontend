import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import { roomsAPI } from "../../../features/roomAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ImagePlus, X } from "lucide-react";

type UpdateHostelProps = { hostel: THostel | null };

type UpdateHostelInputs = {
  hostelId: number;
  hostelName: string;
  location: string;
  contact_number: string;
  rooms_available: number;
  description: string;
  price: number;
};

type RoomInput = {
  roomId?: number;
  roomNumber: string;
  roomType: string;
  price: string;
  capacity: string;
  description: string;
};

const schema = yup.object({
  hostelId: yup.number().required(),
  hostelName: yup.string().required("Hostel name is required"),
  location: yup.string().required("Location is required"),
  contact_number: yup.string().required("Contact is required"),
  rooms_available: yup.number().typeError("Must be a number").required("Rooms required"),
  description: yup.string().required("Description is required"),
  price: yup.number().typeError("Must be a number").required("Price is required"),
});

const UpdateHostel = ({ hostel }: UpdateHostelProps) => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const { register, handleSubmit, setValue, reset, formState: { errors } } =
    useForm<UpdateHostelInputs>({ resolver: yupResolver(schema) });

  const [updateHostel, { isLoading }] = hostelsAPI.useUpdateHostelMutation();
  const [createRoom] = roomsAPI.useCreateRoomMutation();
  const [updateRoom] = roomsAPI.useUpdateRoomMutation();
  const [deleteRoom] = roomsAPI.useDeleteRoomMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomInput[]>([]);

  // ✅ Fetch existing rooms for this hostel
  const { data: existingRooms = [] } = roomsAPI.useGetRoomByHostelIdQuery(
    hostel?.hostelId ?? 0,
    { skip: !hostel?.hostelId }
  );

  useEffect(() => {
    if (hostel) {
      setValue("hostelId", hostel.hostelId);
      setValue("hostelName", hostel.hostelName);
      setValue("location", hostel.location);
      setValue("contact_number", hostel.contact_number);
      setValue("rooms_available", hostel.rooms_available);
      setValue("description", hostel.description);
      setValue("price", hostel.price);
      setImagePreview(hostel.image_URL || null);
      setImageFile(null);
    } else {
      reset();
      setImageFile(null);
      setImagePreview(null);
      setRooms([]);
    }
  }, [hostel, setValue, reset]);

  // ✅ Populate rooms from fetched data
  useEffect(() => {
    if (existingRooms.length > 0) {
      setRooms(
        existingRooms.map((r) => ({
          roomId: r.roomId,
          roomNumber: r.roomNumber,
          roomType: r.roomType,
          price: String(r.price),
          capacity: String(r.capacity),
          description: r.description,
        }))
      );
    }
  }, [existingRooms]);

  /* ================= ROOMS ================= */

  const addRoom = () =>
    setRooms((prev) => [
      ...prev,
      { roomNumber: "", roomType: "", price: "", capacity: "", description: "" },
    ]);

  const removeRoom = async (i: number) => {
    const room = rooms[i];
    if (room.roomId) {
      try {
        await deleteRoom(room.roomId).unwrap();
      } catch {
        toast.error("Failed to delete room");
        return;
      }
    }
    setRooms((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateRoomField = (i: number, field: string, value: string) =>
    setRooms((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );

  /* ================= IMAGE ================= */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  /* ================= SUBMIT ================= */

  const onSubmit: SubmitHandler<UpdateHostelInputs> = async (data) => {
    if (!userId) {
      toast.error("You must be logged in to update a hostel");
      return;
    }

    try {
      // ✅ 1. Update hostel
      const formData = new FormData();
      formData.append("hostelId", String(data.hostelId));
      formData.append("hostelName", data.hostelName);
      formData.append("location", data.location);
      formData.append("contact_number", data.contact_number);
      formData.append("rooms_available", String(rooms.length));
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("userId", String(userId));
      if (imageFile) formData.append("file", imageFile);

      await updateHostel(formData).unwrap();

      // ✅ 2. Save rooms — update existing, create new
      const validRooms = rooms.filter((r) => r.roomNumber && r.roomType);

      await Promise.all(
        validRooms.map((room) => {
          if (room.roomId) {
            // existing room — update
            return updateRoom({ roomId: room.roomId, ...room }).unwrap();
          } else {
            // new room — create
            return createRoom({
              ...room,
              hostelId: data.hostelId,
            }).unwrap();
          }
        })
      );

      toast.success("Hostel updated successfully!");
      reset();
      setRooms([]);
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update hostel");
    }
  };

  const handleClose = () => {
    setImageFile(null);
    if (hostel) setImagePreview(hostel.image_URL || null);
    (document.getElementById("update_modal") as HTMLDialogElement)?.close();
  };

  return (
    <dialog id="update_modal" className="fixed inset-0 z-50 bg-transparent">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50 max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-xl mb-6">Update Hostel</h3>

        {hostel && (
          <div className="bg-slate-50 p-4 rounded-lg mb-4 text-sm">
            <p><strong>Hostel:</strong> {hostel.hostelName}</p>
            <p><strong>Location:</strong> {hostel.location}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit, (errs) => console.log("Validation errors:", errs))}
          className="space-y-4"
        >
          <input type="hidden" {...register("hostelId")} />

          <div>
            <label className="text-sm font-medium">Hostel Name</label>
            <input {...register("hostelName")} className="w-full px-3 py-2 border rounded-md" />
            <p className="text-red-500 text-xs">{errors.hostelName?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <input {...register("location")} className="w-full px-3 py-2 border rounded-md" />
            <p className="text-red-500 text-xs">{errors.location?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Contact</label>
            <input {...register("contact_number")} className="w-full px-3 py-2 border rounded-md" />
            <p className="text-red-500 text-xs">{errors.contact_number?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea {...register("description")} className="w-full px-3 py-2 border rounded-md" />
            <p className="text-red-500 text-xs">{errors.description?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Price (Ksh)</label>
            <input type="number" {...register("price")} className="w-full px-3 py-2 border rounded-md" />
            <p className="text-red-500 text-xs">{errors.price?.message}</p>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Hostel Image
              {imageFile && <span className="ml-2 text-xs text-green-600 font-normal">New image selected</span>}
              {!imageFile && imagePreview && <span className="ml-2 text-xs text-slate-400 font-normal">Current image — click to replace</span>}
            </label>

            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <label className="absolute bottom-2 left-2 bg-white/90 text-xs px-3 py-1 rounded-md cursor-pointer hover:bg-white shadow flex items-center gap-1">
                  <ImagePlus size={13} /> Replace
                  <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageChange} className="hidden" />
                </label>
                {imageFile && (
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X size={14} />
                  </button>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload image</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</span>
                <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* ROOMS */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">Rooms ({rooms.length})</span>
              <button type="button" onClick={addRoom} className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200">
                + Add Room
              </button>
            </div>

            {rooms.map((room, i) => (
              <div key={i} className="border rounded-lg p-3 mb-2 space-y-2 bg-slate-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500">
                    {room.roomId ? `Room ${room.roomNumber} (existing)` : `New Room ${i + 1}`}
                  </span>
                  <button type="button" onClick={() => removeRoom(i)}>
                    <X size={14} className="text-red-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {["roomNumber", "roomType", "price", "capacity"].map((field) => (
                    <input
                      key={field}
                      placeholder={field.replace(/([A-Z])/g, " $1")}
                      value={(room as any)[field]}
                      onChange={(e) => updateRoomField(i, field, e.target.value)}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  ))}
                </div>

                <input
                  placeholder="Description"
                  value={room.description}
                  onChange={(e) => updateRoomField(i, "description", e.target.value)}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-100 rounded-md">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50">
              {isLoading ? "Updating..." : "Update Hostel"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateHostel;