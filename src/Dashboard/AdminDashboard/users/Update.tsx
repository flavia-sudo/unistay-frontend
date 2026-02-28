import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usersAPI } from "../../../features/userAPI";
import { toast } from "sonner";
import { useEffect } from "react";

type UserRole = "admin" | "student" | "Landlord";

type UpdateProfileInputs = {
    firstName: string;
    lastName: string;
    role: UserRole;
};

const schema = yup.object({
    firstName: yup.string().max(50, "Max 50 characters").required("First name is required"),
    lastName: yup.string().max(50, "Max 50 characters").required("Last name is required"),
    role: yup
        .mixed<"admin" | "student" | "Landlord">()
        .oneOf(["admin", "student", "Landlord"])
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
    refetch?: () => void;
}

const UpdateProfile = ({ user, refetch }: UpdateProfileProps) => {
    if (!user) return null;
    const [updateUser, { isLoading }] = usersAPI.useUpdateUserMutation(
        { fixedCacheKey: "updateUser" }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<UpdateProfileInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            role: user?.role ?? "student",
        },
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
            console.log('Update Profile data:', data);

            await updateUser({
                userId: Number(user.userId),
                ...data
            }).unwrap();

            toast.success("Profile updated successfully!");

            if (refetch) {
                refetch();
            }

            reset();
            (document.getElementById('update_profile_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.log("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    return (
        <dialog id="update_profile_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
                <h3 className="font-bold text-lg mb-4">Update Profile</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    
                    <input
                        type="text"
                        {...register("firstName")}
                        placeholder="First Name"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.firstName && (
                        <span className="text-sm text-red-700">
                            {errors.firstName.message}
                        </span>
                    )}

                    <input
                        type="text"
                        {...register("lastName")}
                        placeholder="Last Name"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.lastName && (
                        <span className="text-sm text-red-700">
                            {errors.lastName.message}
                        </span>
                    )}

                    <select
                    {...register("role")}
                    className="input rounded w-full p-2 bg-white text-gray-800"
                    >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="Landlord">Landlord</option>
                    </select>
                    {errors.role && (
                        <span className="text-sm text-red-700">
                            {errors.role.message}
                        </span>
                    )}

                    <div className="modal-action flex flex-col sm:flex-row gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary w-full sm:w-auto"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner text-primary" />
                                    Updating...
                                </>
                            ) : "Update"}
                        </button>

                        <button
                            className="btn w-full sm:w-auto"
                            type="button"
                            onClick={() => {
                                (document.getElementById('update_profile_modal') as HTMLDialogElement)?.close();
                                reset();
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </dialog>
    );
};

export default UpdateProfile;