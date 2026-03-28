import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type UpdateHostelProps = {
  hostel: THostel | null;
};

type UpdateHostelInputs = {
  hostelId: number;
  hostelName: string;
  location: string;
  contact_number: string;
  description: string;
  price: number;
  landlordId: number;
};

const schema = yup.object({
  hostelId: yup.number().required(),
  hostelName: yup.string().required(),
  location: yup.string().required(),
  contact_number: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  landlordId: yup.number().required(),
});

const UpdateHostel = ({ hostel }: UpdateHostelProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateHostelInputs>({
    resolver: yupResolver(schema),
  });

  const [updateHostel, { isLoading }] =
    hostelsAPI.useUpdateHostelMutation();

  useEffect(() => {
    if (hostel) {
      setValue("hostelId", hostel.hostelId);
      setValue("hostelName", hostel.hostelName);
      setValue("location", hostel.location);
      setValue("contact_number", hostel.contact_number);
      setValue("description", hostel.description);
      setValue("price", hostel.price);
      setValue("landlordId", hostel.landlordId);
    } else {
      reset();
    }
  }, [hostel, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateHostelInputs> = async (data) => {
    try {
      await updateHostel(data).unwrap();

      toast.success("Hostel updated successfully!");
      reset();

      (
        document.getElementById("update_modal") as HTMLDialogElement
      )?.close();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update hostel");
    }
  };

  const handleClose = () => {
    (
      document.getElementById("update_modal") as HTMLDialogElement
    )?.close();
  };

  return (
    <dialog
      id="update_modal"
      className="fixed inset-0 z-50 bg-transparent"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="font-bold text-xl mb-6">
          Update Hostel
        </h3>

        {hostel && (
          <div className="bg-slate-50 p-4 rounded-lg mb-4 text-sm">
            <p><strong>Hostel:</strong> {hostel.hostelName}</p>
            <p><strong>Location:</strong> {hostel.location}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input type="hidden" {...register("hostelId")} />
          <input type="hidden" {...register("landlordId")} />

          <div>
            <label className="text-sm">Hostel Name</label>
            <input
              {...register("hostelName")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-red-500 text-xs">
              {errors.hostelName?.message}
            </p>
          </div>

          <div>
            <label className="text-sm">Location</label>
            <input
              {...register("location")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm">Contact</label>
            <input
              {...register("contact_number")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm">Description</label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm">Price</label>
            <input
              type="number"
              {...register("price")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-100 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Hostel"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateHostel;