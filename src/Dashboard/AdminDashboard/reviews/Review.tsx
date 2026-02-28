import { reviewsAPI, type TReview } from "../../../features/reviewAPI";

type TReviewWithRelations = TReview & {
  hostelName?: string;
};

const Review = () => {
  const { data, isLoading } = reviewsAPI.useGetReviewsQuery();

  const reviews: TReviewWithRelations[] = data?.data ?? [];

  const totalReviews = reviews.length;

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Reviews
          </h1>
          <p className="text-slate-500 mt-1">
            Admin view of all hostel reviews
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <p className="text-gray-500">Total Reviews</p>
          <h2 className="text-3xl font-bold">{totalReviews}</h2>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <p className="text-center text-slate-500">
              Loading reviews...
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Hostel Name</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Comment</th>
                  <th className="pb-3">Created At</th>
                </tr>
              </thead>

              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review.reviewId}
                    className="border-b last:border-none"
                  >
                    <td className="py-4 font-medium text-slate-900">
                      {review.hostelName}
                    </td>

                    <td className="py-4 text-slate-600">
                      {review.rating}
                    </td>

                    <td className="py-4 text-slate-600">
                      {review.comment}
                    </td>

                    <td className="py-4 text-slate-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && reviews.length === 0 && (
            <p className="text-center text-slate-500 py-6">
              No reviews found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;