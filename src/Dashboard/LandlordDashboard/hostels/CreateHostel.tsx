import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ImagePlus, X } from "lucide-react";

type CreateHostelProps = { hostel: THostel | null };

type CreateHostelInputs = {
  hostelName: string;
  location: string;
  contact_number: string;
  description: string;
  price: number;
};

const schema = yup.object({
  hostelName: yup.string().required("Hostel name is required"),
  location: yup.string().required("Location is required"),
  contact_number: yup.string().required("Contact number is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().typeError("Must be a number").required("Price is required"),
});

const CreateHostel = ({ hostel }: CreateHostelProps) => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const { register, handleSubmit, setValue, reset, formState: { errors } } =
    useForm<CreateHostelInputs>({ resolver: yupResolver(schema) });

  const [createHostelWithRooms, { isLoading }] =
    hostelsAPI.useCreateHostelWithRoomsMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Expose open method via dialog element for external triggers
  useEffect(() => {
    const dialog = document.getElementById("create_modal") as HTMLDialogElement | null;
    if (!dialog) return;

    // Patch .showModal() and .close() to sync with React state
    const originalShowModal = dialog.showModal?.bind(dialog);
    const originalClose = dialog.close?.bind(dialog);

    dialog.showModal = () => {
      setIsOpen(true);
      originalShowModal?.();
    };
    dialog.close = () => {
      setIsOpen(false);
      originalClose?.();
    };
  }, []);

  useEffect(() => {
    if (hostel) {
      setValue("hostelName", hostel.hostelName);
      setValue("location", hostel.location);
      setValue("contact_number", hostel.contact_number);
      setValue("description", hostel.description);
      setValue("price", hostel.price);
    } else {
      reset();
      setImageFile(null);
      setImagePreview(null);
      setRooms([]);
    }
  }, [hostel, setValue, reset]);

  /* ================= ROOMS ================= */

  const addRoom = () =>
    setRooms((prev) => [...prev, { roomNumber: "", roomType: "", price: "", capacity: "", description: "" , status: true }]);

  const removeRoom = (i: number) =>
    setRooms((prev) => prev.filter((_, idx) => idx !== i));

  const updateRoom = (i: number, field: string, value: string) =>
    setRooms((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

  /* ================= IMAGE ================= */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPG and PNG images allowed");
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

  const onSubmit: SubmitHandler<CreateHostelInputs> = async (data) => {
    if (!userId) { toast.error("You must be logged in"); return; }

    try {
      const formData = new FormData();
      formData.append("hostelName", data.hostelName);
      formData.append("location", data.location);
      formData.append("contact_number", data.contact_number);
      formData.append("rooms_available", String(rooms.length));
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("userId", String(userId));
      formData.append("rooms", JSON.stringify(rooms.filter((r) => r.roomNumber && r.roomType)));
      if (imageFile) formData.append("file", imageFile);

      await createHostelWithRooms(formData).unwrap();
      toast.success("Hostel created successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create hostel");
    }
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImagePreview(null);
    setRooms([]);
    setIsOpen(false);
    // Also close native dialog if it was opened via .showModal()
    const dialog = document.getElementById("create_modal") as HTMLDialogElement | null;
    if (dialog?.open) dialog.close();
  };

  if (!isOpen) {
    // Render a hidden dialog so external code can call document.getElementById("create_modal").showModal()
    return (
      <dialog
        id="create_modal"
        onClose={handleClose}
        className="hidden"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50 max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-xl mb-6 text-gray-800">Create Hostel</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* HOSTEL DETAILS */}
          <div>
            <label className="text-sm font-medium">Hostel Name</label>
            <input {...register("hostelName")} className="w-full px-3 py-2 border rounded-md mt-1" placeholder="e.g. Green Valley Hostels" />
            <p className="text-red-500 text-xs mt-0.5">{errors.hostelName?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <input {...register("location")} className="w-full px-3 py-2 border rounded-md mt-1" placeholder="e.g. Nairobi, Kenya" />
            <p className="text-red-500 text-xs mt-0.5">{errors.location?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Contact Number</label>
            <input {...register("contact_number")} className="w-full px-3 py-2 border rounded-md mt-1" placeholder="e.g. 0712345678" />
            <p className="text-red-500 text-xs mt-0.5">{errors.contact_number?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea {...register("description")} rows={3} className="w-full px-3 py-2 border rounded-md mt-1" placeholder="Describe your hostel..." />
            <p className="text-red-500 text-xs mt-0.5">{errors.description?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Price per Semester (Ksh)</label>
            <input
              type="text"
              inputMode="numeric"
              {...register("price")}
              className="w-full px-3 py-2 border rounded-md mt-1"
              placeholder="e.g. 25000"
            />
            <p className="text-red-500 text-xs mt-0.5">{errors.price?.message}</p>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Hostel Image
              {imageFile && <span className="ml-2 text-xs text-green-600 font-normal">Image selected</span>}
            </label>

            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload image</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</span>
                <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* ROOMS */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Rooms ({rooms.length})</span>
              <button
                type="button"
                onClick={addRoom}
                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                + Add Room
              </button>
            </div>

            {rooms.map((room, i) => (
              <div key={i} className="border rounded-lg p-3 mb-2 space-y-2 bg-slate-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500">Room {i + 1}</span>
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
                      onChange={(e) => updateRoom(i, field, e.target.value)}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  ))}
                </div>

                <input
                  placeholder="Description"
                  value={room.description}
                  onChange={(e) => updateRoom(i, "description", e.target.value)}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                />
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-100 rounded-md text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Hostel"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateHostel;