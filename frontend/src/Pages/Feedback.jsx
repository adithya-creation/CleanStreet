import React, { useEffect, useState } from "react";
import { getMyComplaints } from "../services/complaintService";
import { submitFeedback } from "../services/feedbackService";
import NavBar from "../Components/common/NavBar";
import Footer from "../Components/common/Footer";
import { Star } from "lucide-react";

const Feedback = () => {

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [serviceQuality, setServiceQuality] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [professionalism, setProfessionalism] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getMyComplaints();
        setComplaints(data.complaints || []);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    };

    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitFeedback({
        complaintId: selectedComplaint,
        rating,
        serviceQuality,
        responseTime,
        professionalism,
        comment
      });

      alert("Thank you! Your feedback has been submitted.");

      setSelectedComplaint("");
      setRating(0);
      setServiceQuality("");
      setResponseTime("");
      setProfessionalism("");
      setComment("");

    } catch (err) {
  console.error("FULL ERROR:", err);
  console.error("ERROR RESPONSE:", err.response);
  alert(err.response?.data?.message || "Something went wrong");
}
  };

  return (
    <>
      <NavBar />

      <div className="bg-gray-50 flex flex-col min-h-screen">

        <div className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-6">

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">

              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Volunteer Service Feedback
              </h1>

              <p className="text-gray-500 mb-6">
                Your feedback helps us improve community services and ensure
                better cleanliness management. Please share your experience
                with the volunteer who handled your complaint.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Complaint */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Select Complaint
                  </label>

                  <select
                    value={selectedComplaint}
                    onChange={(e) => setSelectedComplaint(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select Complaint</option>

                    {complaints.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Overall Rating
                  </label>

                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        size={30}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer transition ${
                          rating >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {rating > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      You rated this service {rating} out of 5
                    </p>
                  )}
                </div>

                {/* Service Quality */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Service Quality
                  </label>

                  <select
                    value={serviceQuality}
                    onChange={(e) => setServiceQuality(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select option</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Average</option>
                    <option>Poor</option>
                  </select>
                </div>

                {/* Response Time */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Response Time
                  </label>

                  <select
                    value={responseTime}
                    onChange={(e) => setResponseTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select option</option>
                    <option>Very Fast</option>
                    <option>Fast</option>
                    <option>Average</option>
                    <option>Slow</option>
                  </select>
                </div>

                {/* Professionalism */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Volunteer Professionalism
                  </label>

                  <select
                    value={professionalism}
                    onChange={(e) => setProfessionalism(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select option</option>
                    <option>Very Professional</option>
                    <option>Professional</option>
                    <option>Neutral</option>
                    <option>Needs Improvement</option>
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Additional Comments
                  </label>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share more details about your experience..."
                    className="w-full border border-gray-200 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Submit Feedback
                </button>

              </form>

            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
};

export default Feedback;