import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { Search, Star } from "lucide-react";
import { reviewsAPI, type TReview } from "../../../features/reviewAPI";
import { hostelsAPI } from "../../../features/hostelAPI";

const ViewReview = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const { data: reviews = [], isLoading, error } = reviewsAPI.useGetReviewsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 50000,
  });

  const { data: hostels = [] } = hostelsAPI.useGetHostelsQuery(undefined);

  const [search, setSearch] = useState("");

  const landlordHostelNames = useMemo(
    () => new Set(hostels.filter((h) => h.userId === userId).map((h) => h.hostelName)),
    [hostels, userId]
  );

  const filteredReviews = useMemo(() => {
    if (!landlordHostelNames.size) return [];

    return reviews.filter((r: TReview) => {
      const inHostel = landlordHostelNames.has(r.hostelName ?? "");

      const matchesSearch = `${r.hostelName} ${r.comment} ${r.firstName} ${r.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());

      return inHostel && matchesSearch;
    });
  }, [reviews, landlordHostelNames, search]);

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 bg-linear-to-r from-amber-500 to-orange-600 rounded-2xl shadow-sm px-8 py-10">
          <h1 className="text-4xl font-bold text-white">Hostel Reviews</h1>
          <p className="text-orange-100 mt-3">View all reviews made on your hostels</p>
        </div>

        {/* STATS */}
        <div className="mb-6 bg-orange-50 border border-orange-100 rounded-2xl shadow-sm px-8 py-6">
          <p className="text-orange-700">Total Reviews</p>
          <h2 className="text-4xl font-bold text-orange-700 mt-3">{filteredReviews.length}</h2>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        {/* TABLE */}
        {isLoading && <p className="text-center text-slate-500">Loading reviews...</p>}
        {error   && <p className="text-red-600 text-center">Error loading reviews</p>}

        {!isLoading && filteredReviews.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Star className="w-14 h-14 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium">No reviews found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Comment</th>
                  <th className="pb-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.reviewId} className="border-b last:border-none">
                    <td className="py-4 font-medium text-slate-900">
                      {review.firstName} {review.lastName}
                    </td>
                    <td className="py-4 text-slate-700">{review.hostelName}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-slate-500">({review.rating})</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">{review.comment}</td>
                    <td className="py-4 text-slate-600">{new Date(review.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReview;