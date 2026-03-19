import React, { useEffect, useState } from "react";
import { getMyVolunteerRatings } from "../services/feedbackService";
import NavBar from "../Components/common/NavBar";
import Footer from "../Components/common/Footer";
import { Star, TrendingUp, Users, Award, MessageSquare, Clock, Shield } from "lucide-react";
import { Navigate } from "react-router-dom";

const VolunteerRatings = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "volunteer") {
    return <Navigate to="/unauthorized" />;
  }

  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, avgRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const data = await getMyVolunteerRatings();
      setRatings(data.ratings || []);
      setStats(data.stats || stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const ratingColors = ["", "text-red-500", "text-orange-500", "text-yellow-500", "text-teal-500", "text-emerald-500"];

  if (loading) {
    return (
      <div className="font-sans text-slate-700">
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">Loading your ratings…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-700">
      <NavBar />

      <div className="bg-[#fcfaf8] min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-6">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-teal-100/50 rounded-xl text-teal-600">
                <Award size={28} />
              </div>
              My Ratings
            </h2>
            <p className="text-slate-500 mt-2">See how users rate your community service work</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Average Rating */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Average Rating</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-5xl font-black text-slate-800">{stats.avgRating || "—"}</p>
                <Star size={28} className="text-yellow-400 fill-yellow-400" />
              </div>
              <p className={`text-sm font-semibold ${stats.avgRating > 0 ? ratingColors[Math.round(stats.avgRating)] : 'text-slate-400'}`}>
                {stats.avgRating > 0 ? ratingLabels[Math.round(stats.avgRating)] : "No ratings yet"}
              </p>
            </div>

            {/* Total Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Total Reviews</p>
              <p className="text-5xl font-black text-slate-800">{stats.totalReviews}</p>
              <p className="text-sm font-semibold text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                <Users size={14} /> From community members
              </p>
            </div>

            {/* Star Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Rating Breakdown</p>
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution?.[star] || 0;
                  const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 w-4 text-right">{star}</span>
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <h3 className="text-lg font-black text-slate-800 mb-4">All Reviews</h3>

          {ratings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No Reviews Yet</h3>
              <p className="text-sm text-slate-500">You'll see user reviews here once they rate your service.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((r) => (
                <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:border-teal-100 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Left side */}
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm uppercase shrink-0 overflow-hidden">
                        {r.userId?.profilePhoto
                          ? <img src={r.userId.profilePhoto} alt="" className="w-full h-full object-cover" />
                          : (r.userId?.name || "U")[0]
                        }
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">{r.userId?.name || "Anonymous"}</p>
                        {r.complaintId && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            Complaint: <span className="font-semibold text-slate-500">{r.complaintId.title}</span>
                          </p>
                        )}
                        {r.serviceQuality === 'Admin Review' && (
                          <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-1">
                            Admin Review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right side: stars + date */}
                    <div className="text-right">
                      <div className="flex gap-0.5 justify-end mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={18} className={r.rating >= s ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  {(r.professionalism || r.responseTime || r.serviceQuality) && r.serviceQuality !== 'Admin Review' && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {r.professionalism && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                          <Shield size={12} /> {r.professionalism}
                        </span>
                      )}
                      {r.responseTime && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 px-3 py-1 rounded-full">
                          <Clock size={12} /> {r.responseTime}
                        </span>
                      )}
                      {r.serviceQuality && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                          <TrendingUp size={12} /> {r.serviceQuality}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Comment */}
                  {r.comment && (
                    <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed italic">"{r.comment}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VolunteerRatings;
