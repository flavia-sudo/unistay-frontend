import { useState } from "react";
import CreateReview from "./CreateReview";
import UpdateReview from "./UpdateReview";
import DeleteReview from "./DeleteReview";
import { reviewsAPI, type TReview } from "../../../features/reviewAPI";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

type TReviewWithRelations = TReview & {
  hostelName?: string;
};

const UserReview = () => {
  const userString = localStorage.getItem("User");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?.userId;

  const {
    data: response,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = reviewsAPI.useGetReviewByUserIdQuery(userId!, {
    skip: !userId, // prevent firing query if no userId
    refetchOnMountOrArgChange: true,
    pollingInterval: 50000,
  });

  // Extract the array from { data: TReview[] }
  const reviews: TReviewWithRelations[] = Array.isArray(response?.data)
    ? response.data
    : [];

  const [selectedReview, setSelectedReview] = useState<TReviewWithRelations | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<TReviewWithRelations | null>(null);

  const handleEdit = (review: TReviewWithRelations) => {
    setSelectedReview(review);
    (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-linear-to-r from-indigo-400 via-purple-500 to-purple-600 rounded-2xl shadow-sm px-8 py-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Reviews</h1>
            <p className="text-slate-800 mt-2">Manage your hostel reviews</p>
          </div>

          <button
            onClick={() =>
              (document.getElementById("create_modal") as HTMLDialogElement)?.showModal()
            }
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium shadow hover:bg-gray-100 transition"
          >
            + Create Review
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm px-8 py-6">
          <p className="text-indigo-700">Total Reviews</p>
          <h2 className="text-4xl font-bold text-indigo-700 mt-3">{reviews.length}</h2>
        </div>

        {/* Modals */}
        <CreateReview />
        <UpdateReview review={selectedReview} />
        <DeleteReview review={reviewToDelete} />

        {/* Table */}
        {reviewsLoading && <p className="text-center text-slate-500">Loading reviews...</p>}
        {reviewsError && <p className="text-red-600">Error loading reviews</p>}

        {reviews.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Hostel Name</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Comment</th>
                  <th className="pb-3">Created At</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.reviewId} className="border-b last:border-none">
                    <td className="py-4 font-medium text-slate-900">{review.hostelName}</td>
                    <td className="py-4">
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {Array.from({ length: 5}).map((_, index) => (
                                    <span
                                      key={index}
                                      className={
                                      index < review.rating
                                      ? "text-yellow-400 text-lg"
                                      : "text-gray-300 text-lg"
                                    }
                                    >★
                                </span>
                             ))}
                            </div>
                            <span className="text-sm text-slate-500">
                            ({review.rating})
                            </span>
                            </div>
                        </td>
                    <td className="py-4 font-medium text-slate-600">{review.comment}</td>
                    <td className="py-4 font-medium text-slate-600">{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-md transition"
                        onClick={() => handleEdit(review)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow-md transition"
                        onClick={() => {
                          setReviewToDelete(review);
                          (
                            document.getElementById("delete_modal") as HTMLDialogElement
                          )?.showModal();
                        }}
                      >
                        <MdDeleteForever />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !reviewsLoading && (
            <p className="text-gray-600 mt-6 text-center text-base">No reviews found</p>
          )
        )}
      </div>
    </div>
  );
};

export default UserReview;