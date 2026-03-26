import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { reviewsAPI, type TReview } from "../../../features/reviewAPI";


type TReviewWithRelations = TReview & {
    hostelName?: string
}
type CreateReviewInputs = {
    hostelName: string;
    rating: number;
    comment: string;
};

const schema = yup.object({
    hostelName: yup.string().required("Hostel is required"),
    rating: yup.number().required("Rating is required"),
    comment: yup.string().required("Comment is required"),
});

const CreateReview = () => {
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<CreateReviewInputs>({
        resolver: yupResolver(schema),
    });

    const user = localStorage.getItem("User");
    const userId = user ? JSON.parse(user).userId : null;

    const [createReview, { isLoading }] = reviewsAPI.useCreateReviewMutation();

    const onSubmit: SubmitHandler<CreateReviewInputs> = async (data) => {
        if (!userId) {
            toast.error("User not logged in.");
            return;
        }

        try {
            const payload: TReviewWithRelations = {
                ...data,
                userId,
            } as unknown as TReview;
            await createReview(payload).unwrap();
            toast.success("Review created successfully!");
            reset();
            (document.getElementById("create_modal") as HTMLDialogElement)?.close();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create review. Please try again.");
        }
    };

    const handleClose = () => {
        (document.getElementById("create_modal") as HTMLDialogElement)?.close();
    };

    return (
        <dialog id="create_modal" className="fixed inset-0 z-50 bg-transparent">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}>
            </div>
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Create Review</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="form-control w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                        <input
                        type="text"
                        {...register("hostelName")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.hostelName && ( <p className="text-red-500 text-xs mt-1">{errors.hostelName.message}</p>
                    )}
                    </div>
                    
                    <div className="form-control w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <input type="number" {...register("rating")} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {errors.rating && (<p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
                    )}
                    </div>
                    
                    <div className="form-control w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <input type="text" {...register("comment")} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.comment && (<p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>)}
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
                        className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        {isLoading ? "Creating..." : "Create Review"}
                    </button>
                    </div>
                    </form></div>
        </dialog>
    );
};

export default CreateReview;