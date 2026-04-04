import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { reviewsAPI } from "../../../features/reviewAPI";
import { hostelsAPI, type THostel } from "../../../features/hostelAPI"; // ✅ added

type CreateReviewInputs = {
    hostel_id: number; // still needed for backend
    rating: number;
    comment: string;
};

const schema = yup.object({
    hostel_id: yup
        .number()
        .typeError("Hostel is required")
        .required("Hostel is required"),
    rating: yup
        .number()
        .typeError("Rating must be a number")
        .min(1)
        .max(5)
        .required(),
    comment: yup.string().required(),
});

const CreateReview = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateReviewInputs>({
        resolver: yupResolver(schema),
    });

    const userId = useSelector((state: RootState) => state.auth.user?.userId);

    const [createReview, { isLoading }] = reviewsAPI.useCreateReviewMutation();

    // ✅ fetch hostels
    const { data: hostels = [] } = hostelsAPI.useGetHostelsQuery();

    const onSubmit: SubmitHandler<CreateReviewInputs> = async (data) => {
        if (!userId) {
            toast.error("User not logged in.");
            return;
        }

        try {
            const payload = {
                hostel_id: Number(data.hostel_id), // ensure number
                user_id: userId,
                rating: data.rating,
                comment: data.comment,
            };

            await createReview(payload as any).unwrap();

            toast.success("Review created successfully!");
            reset();
            (document.getElementById("create_modal") as HTMLDialogElement)?.close();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create review.");
        }
    };

    const handleClose = () => {
        reset();
        (document.getElementById("create_modal") as HTMLDialogElement)?.close();
    };

    return (
        <dialog id="create_modal" className="fixed inset-0 z-50 bg-transparent">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Create Review</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* ✅ HOSTEL NAME DROPDOWN */}
                    <div className="form-control w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Hostel
                        </label>

                        <select
                            {...register("hostel_id")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">-- Select Hostel --</option>

                            {hostels.map((hostel: THostel) => (
                                <option key={hostel.hostelId} value={hostel.hostelId}>
                                    {hostel.hostelName}
                                </option>
                            ))}
                        </select>

                        {errors.hostel_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.hostel_id.message}
                            </p>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="form-control w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating (1–5)
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            {...register("rating")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        {errors.rating && (
                            <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
                        )}
                    </div>

                    {/* Comment */}
                    <div className="form-control w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comment
                        </label>
                        <textarea
                            rows={3}
                            {...register("comment")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                        />
                        {errors.comment && (
                            <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            {isLoading ? "Creating..." : "Create Review"}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default CreateReview;