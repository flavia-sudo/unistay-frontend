import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type CreateHostelProps = {
  hostel: THostel | null;
};

type CreateHostelInputs = {
  hostelName: string;
  location: string;
  contact_number: string;
  rooms_available: number;
  description: string;
  price: number;
  landlordId: number;
};

const schema = yup.object({
  hostelName: yup.string().required("Hostel name is required"),
  location: yup.string().required("Location is required"),
  contact_number: yup.string().required("Contact number is required"),
  rooms_available: yup.number().required("Rooms available is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required"),
  landlordId: yup.number().required(),
});

const CreateHostel = ({ hostel }: CreateHostelProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateHostelInputs>({
    resolver: yupResolver(schema),
  });

  const [createHostel, { isLoading }] =
    hostelsAPI.useCreateHostelMutation();

  useEffect(() => {
    const storedLandlord = localStorage.getItem("landlord");

    if (storedLandlord) {
      const parsed = JSON.parse(storedLandlord);
      setValue("landlordId", parsed.landlordId);
    }

    if (hostel) {
      setValue("hostelName", hostel.hostelName);
      setValue("location", hostel.location);
      setValue("contact_number", hostel.contact_number);
      setValue("rooms_available", hostel.rooms_available);
      setValue("description", hostel.description);
      setValue("price", hostel.price);
      setValue("landlordId", hostel.landlordId);
    } else {
      reset();
    }
  }, [hostel, setValue, reset]);

  const onSubmit: SubmitHandler<CreateHostelInputs> = async (data) => {
    try {
      const response = await createHostel(data).unwrap();
      console.log("Hostel created successfully", response);

      toast.success("Hostel created successfully!");
      reset();

      (
        document.getElementById("create_modal") as HTMLDialogElement
      )?.close();
    } catch (error) {
      console.error("Error creating hostel:", error);
      toast.error("Failed to create hostel. Try again.");
    }
  };

  const handleClose = () => {
    (
      document.getElementById("create_modal") as HTMLDialogElement
    )?.close();
  };

  return (
    <dialog
      id="create_modal"
      className="fixed inset-0 z-50 bg-transparent"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="font-bold text-xl mb-6 text-gray-800">
          Create Hostel
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Hostel Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Hostel Name
            </label>
            <input
              type="text"
              {...register("hostelName")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-red-500 text-xs">
              {errors.hostelName?.message}
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              {...register("location")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-red-500 text-xs">
              {errors.location?.message}
            </p>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Number
            </label>
            <input
              type="text"
              {...register("contact_number")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-red-500 text-xs">
              {errors.contact_number?.message}
            </p>
          </div>

          {/* Rooms Available */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Rooms Available
            </label>
            <input
              type="number"
              {...register("rooms_available")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-red-500 text-xs">
              {errors.rooms_available?.message}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-red-500 text-xs">
              {errors.description?.message}
            </p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (Ksh)
            </label>
            <input
              type="number"
              {...register("price")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-red-500 text-xs">
              {errors.price?.message}
            </p>
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
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              {isLoading ? "Creating..." : "Create Hostel"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateHostel;