import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usersAPI } from "../../../features/userAPI";
import { toast } from "sonner";
import { useEffect } from "react";

type UserRole = "admin" | "student" | "landlord";

type UpdateProfileInputs = {
  firstName: string;
  lastName: string;
  role: UserRole;
};

const schema = yup.object({
  firstName: yup.string().max(50, "Max 50 characters").required("First name is required"),
  lastName: yup.string().max(50, "Max 50 characters").required("Last name is required"),
  role: yup
    .mixed<UserRole>()
    .oneOf(["admin", "student", "landlord"])
    .required("Role is required"),
});

interface User {
  userId: string | number;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

interface UpdateProfileProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
}

const UpdateProfile = ({ user, isOpen, onClose, refetch }: UpdateProfileProps) => {
  const [updateUser, { isLoading }] = usersAPI.useUpdateUserMutation();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<UpdateProfileInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("role", user.role ?? "student");
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
    try {
      await updateUser({ userId: Number(user!.userId), ...data }).unwrap();
      toast.success("Profile updated successfully!");
      refetch?.();
      onClose();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (!isOpen || !user) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <dialog id="update_profile_modal" className="fixed inset-0 z-50 bg-transparent">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Box */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Update Profile</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("firstName")}
            placeholder="First Name"
            className="input p-2 border rounded w-full"
          />
          {errors.firstName && <span className="text-sm text-red-600">{errors.firstName.message}</span>}

          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            className="input p-2 border rounded w-full"
          />
          {errors.lastName && <span className="text-sm text-red-600">{errors.lastName.message}</span>}

          <select {...register("role")} className="input p-2 border rounded w-full">
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="Landlord">Landlord</option>
          </select>
          {errors.role && <span className="text-sm text-red-600">{errors.role.message}</span>}

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateProfile;