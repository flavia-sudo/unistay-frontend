import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { paymentsAPI, type TPayment } from "../../../features/paymentAPI";

type TPaymentWithRelations = TPayment & {
    firstName?: string;
    lastName?: string;
    hostelName?: string;
    roomNumber?: string;
}
type UpdatePaymentProps = {
    payment: TPaymentWithRelations | null;
};

type UpdatePaymentInputs = {
    bookingId: number;
    userId: number;
    amount: number;
    method: string;
    paymentStatus: boolean;
};

const schema = yup.object({
    bookingId: yup.number().required("Booking ID is required"),
    userId: yup.number().required("User ID is required"),
    amount: yup.number().required("Amount is required"),
    method: yup.string().required("Payment method is required"),
    paymentStatus: yup.boolean().required("Payment status is required"),
});

const UpdatePayment = ({ payment }: UpdatePaymentProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<UpdatePaymentInputs>({
        resolver: yupResolver(schema),
    });

    const [UpdatePayment, { isLoading }] = paymentsAPI.useUpdatePaymentMutation();

    useEffect(() => {
        if (payment) {
            setValue("bookingId", payment.bookingId);
            setValue("userId", payment.userId);
            setValue("amount", payment.amount);
            setValue("method", payment.method);
            setValue("paymentStatus", payment.paymentStatus);
        } else {
            reset();
        }
    }, [payment, reset, setValue]);

    const onSubmit: SubmitHandler<UpdatePaymentInputs> = async (data) => {
        try {
            if (!payment) {
                toast.error("No payment selected for update.");
                return;
            }

            const response = await UpdatePayment({ paymentId: payment.paymentId, ...data });
            console.log("Payment updated successfully", response);
            toast.success("Payment updated successfully!");
            reset();
            (document.getElementById("update_modal") as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error updating payment:", error);
            toast.error("Failed to update payment. Please try again.");
        }
    };

    const handleClose = () => {
    ;(document.getElementById('update_modal') as HTMLDialogElement)?.close()
    }
    return (
        <dialog id="update_modal" className="fixed inset-0 z-50 bg-transparent">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            ></div>
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Update Payment</h3>
                {payment && (
                    <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm">
            <p>
              <span className="font-medium">Paid By:</span>{" "}
              {payment.firstName} {payment.lastName}
            </p>
            <p>
              <span className="font-medium">Hostel:</span>{" "}
              {payment.hostelName}
            </p>
            <p>
              <span className="font-medium">Room:</span>{" "}
              {payment.roomNumber}
            </p>
          </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="form-control w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Booking ID
                        </label>
                        <input type="number" {...register("bookingId")} className="input input-bordered w-full max-w-xs" />
                        {errors.bookingId && <span className="text-red-500 text-xs">{errors.bookingId.message}</span>}
                    </div>
                    <div className="form-control w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input type="number" step="0.01" {...register("amount")} className="input input-bordered w-full max-w-xs" />
                        {errors.amount && <span className="text-red-500 text-xs">{errors.amount.message}</span>}
                    </div>
                    <div className="form-control w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Method
                        </label>
                        <input type="text" {...register("method")} className="input input-bordered w-full max-w-xs" />
                        {errors.method && <span className="text-red-500 text-xs">{errors.method.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <input
                        type="text"
                        placeholder="e.g. pending"
                        {...register("paymentStatus")}
                        className="input input-bordered w-full"
                        />
                        {errors.paymentStatus && <p className="text-red-500 text-xs">{errors.paymentStatus.message}</p>}
                    </div>
                    {/* Action buttons */}
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
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                        {isLoading ? "Updating..." : "Update Payment"}
                        </button>
                    </div>
                    </form>
            </div>
        </dialog>
    )
};

export default UpdatePayment;