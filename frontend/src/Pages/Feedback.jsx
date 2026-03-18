import React, { useEffect, useState } from "react";
import { getMyComplaints } from "../services/complaintService";
import { submitFeedback } from "../services/feedbackService";
import NavBar from "../Components/common/NavBar";
import Footer from "../Components/common/Footer";
import { Star, MessageSquare } from "lucide-react"; 
import { Navigate } from "react-router-dom";

const Feedback = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "user") {
    return <Navigate to="/unauthorized" />;
  }

  const [activeTab, setActiveTab] = useState("complaint");
  const [complaints, setComplaints] = useState([]);

  // State for Service Feedback
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [serviceRating, setServiceRating] = useState(0);
  const [serviceQuality, setServiceQuality] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [professionalism, setProfessionalism] = useState("");
  const [comment, setComment] = useState("");

  // State for Platform Feedback
  const [platformRating, setPlatformRating] = useState(0);
  const [queries, setQueries] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [issues, setIssues] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback({
        type: "complaint",
        complaintId: selectedComplaint,
        rating: serviceRating, // Fixed: was 'rating'
        serviceQuality,
        responseTime,
        professionalism,
        comment
      });
      alert("Service feedback submitted!");
      resetForm();
    } catch (err) {
      alert("Error submitting feedback");
    }
  };

  const handlePlatformSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback({
        type: "platform",
        rating: platformRating, 
        queries,
        suggestions,
        issues
      });
      alert("Platform feedback submitted!");
      resetForm();
    } catch (err) {
  console.error("FULL ERROR:", err);

  const message =
    err.response?.data?.message || "Something went wrong";

  showToast(message); // replace alert later
}

  };

  const resetForm = () => {
    setSelectedComplaint("");
    setServiceRating(0);
    setPlatformRating(0);
    setServiceQuality("");
    setResponseTime("");
    setProfessionalism("");
    setComment("");
    setQueries("");
    setSuggestions("");
    setIssues("");
  };

  return (
    <div className="font-sans text-slate-700"> 
      <NavBar />

      <div className="bg-[#fcfaf8] min-h-screen py-10">
        <div className="max-w-3xl mx-auto px-6">
          
          <h2 className="text-3xl font-extrabold text-slate-800 mb-6">Feedback Center</h2>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab("complaint")}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                activeTab === "complaint"
                  ? "bg-[#0eb1a3] text-white shadow-md"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Service Feedback
            </button>

            <button
              onClick={() => setActiveTab("platform")}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                activeTab === "platform"
                  ? "bg-[#0eb1a3] text-white shadow-md"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Platform Experience
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            {/* ================= SERVICE FEEDBACK ================= */}
            {activeTab === "complaint" && (
              <form onSubmit={handleComplaintSubmit} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">Volunteer Service</h1>
                  <p className="text-slate-500 text-sm">Help us improve our community service by rating your recent experience.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Select Issue Reference</label>
                  <select
                    value={selectedComplaint}
                    onChange={(e) => setSelectedComplaint(e.target.value)}
                    className="w-full border-slate-200 border p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  >
                    <option value="">Select your complaint</option>
                    {complaints.map((c) => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                {selectedComplaint && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-teal-600 uppercase mb-1">Reviewing Volunteer:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                        {(complaints.find(c => c._id === selectedComplaint)?.volunteer?.name || "V")[0]}
                      </div>
                      <p className="font-semibold text-slate-700">
                        {complaints.find(c => c._id === selectedComplaint)?.volunteer?.name || "Not Assigned"}
                      </p>
                    </div>
                  </div>
                )}

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-600">Overall Satisfaction</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={28}
                          onClick={() => setServiceRating(star)}
                          className={`cursor-pointer transition-colors ${
                            serviceRating >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Professionalism */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Volunteer Professionalism</label>
                    <select
                      value={professionalism}
                      onChange={(e) => setProfessionalism(e.target.value)}
                      className="w-full border-slate-200 border p-3 rounded-xl"
                    >
                      <option value="">How was their behavior?</option>
                      <option>Very Professional</option>
                      <option>Professional</option>
                      <option>Neutral</option>
                      <option>Needs Improvement</option>
                    </select>
                  </div>

                  {/* Response Speed */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Resolution Speed</label>
                    <select
                      value={responseTime}
                      onChange={(e) => setResponseTime(e.target.value)}
                      className="w-full border-slate-200 border p-3 rounded-xl"
                    >
                      <option value="">Was the response timely?</option>
                      <option>Very Fast</option>
                      <option>Fast</option>
                      <option>Average</option>
                      <option>Slow</option>
                    </select>
                  </div>

                  {/* Response Quality */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Work Quality</label>
                    <select
                      value={serviceQuality}
                      onChange={(e) => setServiceQuality(e.target.value)}
                      className="w-full border-slate-200 border p-3 rounded-xl"
                    >
                      <option value="">How would you rate the work?</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Additional Comments</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us more about the resolution..."
                    className="w-full border-slate-200 border p-3 rounded-xl h-28 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <button className="w-full bg-[#0eb1a3] hover:bg-[#0c968a] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-100">
                  Submit Service Review
                </button>
              </form>
            )}

            {/* ================= PLATFORM FEEDBACK ================= */}
            {activeTab === "platform" && (
              <form onSubmit={handlePlatformSubmit} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">App Experience</h1>
                  <p className="text-slate-500 text-sm">Help us make the platform better for everyone.</p>
                </div>

                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <label className="block text-center text-lg font-semibold text-slate-700">
                    How likely are you to recommend this platform?
                  </label>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={40}
                        onClick={() => setPlatformRating(star)}
                        className={`cursor-pointer transition-transform active:scale-90 ${
                          platformRating >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Queries & Doubts</label>
                  <textarea
                    value={queries}
                    onChange={(e) => setQueries(e.target.value)}
                    placeholder="Is there anything you find confusing?"
                    className="w-full border-slate-200 border p-3 rounded-xl h-24 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Feature Suggestions</label>
                  <textarea
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    placeholder="What new features would you like to see?"
                    className="w-full border-slate-200 border p-3 rounded-xl h-24 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Technical Issues</label>
                  <textarea
                    value={issues}
                    onChange={(e) => setIssues(e.target.value)}
                    placeholder="Did you encounter any bugs or errors?"
                    className="w-full border-slate-200 border p-3 rounded-xl h-24 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <button className="w-full bg-[#0eb1a3] hover:bg-[#0c968a] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-100">
                  Submit Platform Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Feedback;