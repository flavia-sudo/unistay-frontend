import { reviewsAPI, type TReview } from "../../../features/reviewAPI";

type TReviewWithRelations = TReview & {
  hostelName?: string;
};

const Review = () => {
  const { data: response, isLoading } = reviewsAPI.useGetReviewsQuery();
  console.log("Reviews:", response);

  const reviews: TReviewWithRelations[] = response? (response as TReviewWithRelations[]) : [];

  const totalReviews = reviews.length;

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-linear-to-r from-indigo-400 via-purple-500 to-purple-600 rounded-2xl shadow-sm px-8 py-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Reviews
          </h1>
          <p className="text-slate-800 mt-4">
            Admin view of all hostel reviews
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm px-8 py-6">
          <p className="text-indigo-700">Total Reviews</p>
          <h2 className="text-4xl font-bold text-indigo-700 mt-3">{totalReviews}</h2>
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

                    <td className="py-4 text-slate-600">
                      {review.comment}
                    </td>

                    <td className="py-4 text-slate-600 text-sm">
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