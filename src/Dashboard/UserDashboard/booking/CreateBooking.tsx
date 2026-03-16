import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { bookingsAPI, type TBooking } from "../../../features/bookingAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
type TBookingWithRelations = TBooking & {
    firstName: string;
    lastName: string;
    hostelName: string;
    roomNumber: string;
}
type CreateBookingProps = {
    booking: TBookingWithRelations | null;
};

type CreateBookingInputs = {
    hostelId: number;
    roomId: number;
    userId: number;
    checkInDate: Date;
    duration: string;
    totalAmount: number;
    bookingStatus: boolean;
};

const schema = yup
    .object({
        hostelId: yup.number().required(),
        roomId: yup.number().required(),
        userId: yup.number().required(),
        checkInDate: yup.date().required(),
        duration: yup.string().required(),
        totalAmount: yup.number().required(),
        bookingStatus: yup.boolean().required(),
    })

    const CreateBooking = ({ booking }: CreateBookingProps) => {
        const {
            register,
            handleSubmit,
            setValue,
            formState: { errors },
            reset,
        } = useForm<CreateBookingInputs>({
            resolver: yupResolver(schema),
        });
        const [createBooking, { isLoading }] = bookingsAPI.useCreateBookingMutation();

        useEffect(() => {
            if (booking) {
                setValue("checkInDate", booking.checkInDate);
                setValue("duration", booking.duration);
                setValue("totalAmount", booking.totalAmount);
                setValue("bookingStatus", booking.bookingStatus);
            } else {
                reset();
            }
        }, [booking, setValue]);

        const onSubmit: SubmitHandler<CreateBookingInputs> = async (data) => {
            if (!booking) {
                toast.error("No booking selected for update.");
                return;
            }
            try {
                const response = await createBooking(data);
                console.log("Booking created successfully", response);
                toast.success("Booking created successfully!");
                reset();
                (document.getElementById("create_modal") as HTMLDialogElement)?.close();
            } catch (error) {
                console.error("Error creating booking:", error);
                toast.error("Failed to create booking. Please try again.");
            }
        };

        const handleClose = () => {
            (document.getElementById("create_modal") as HTMLDialogElement)?.close();
        };

        return (
            <dialog id="update_modal" className="fixed inset-0 z-50 bg-transparent">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50">
                <h3 className="font-bold text-xl mb-6 text-gray-800">
                Update Booking
                </h3>

                {booking && (
                <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm">
                    <p>
                    <span className="font-medium">First Name:</span>{" "}
                    {booking.firstName}
                    </p>
                    <p>
                    <span className="font-medium">Last Name:</span>{" "}
                    {booking.lastName}
                    </p>
                    <p>
                    <span className="font-medium">Hostel:</span>{" "}
                    {booking.hostelName}
                    </p>
                    <p>
                    <span className="font-medium">Room:</span>{" "}
                    {booking.roomNumber}
                    </p>
                </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                    Check In Date
                    </label>
                    <input
                    type="date"
                    {...register("checkInDate")}
                    className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.checkInDate && (
                    <p className="text-red-500 text-xs">
                        {errors.checkInDate.message}
                    </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                    Duration
                    </label>
                    <input
                    type="text"
                    {...register("duration")}
                    className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                    Total Amount
                    </label>
                    <input
                    type="number"
                    {...register("totalAmount")}
                    className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                    Booking Status
                    </label>
                    <select
                    {...register("bookingStatus", {
                        setValueAs: (value) => value === "true",
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    >
                    <option value="true">Confirmed</option>
                    <option value="false">Cancelled</option>
                    </select>
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
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                    >
                    {isLoading ? "Creating..." : "Create Booking"}
                    </button>
                </div>
                </form>
            </div>
            </dialog>
        );
    };

export default CreateBooking;