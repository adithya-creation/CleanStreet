import React, { useEffect, useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import NavBar from "../Components/common/NavBar";
import Footer from "../Components/common/Footer";
import { getComplaints } from "../services/complaintService";

/* ===== Leaflet marker fix ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== Status config ===== */
const statusMap = {
  received: {
    label: "Pending",
    badge: "bg-yellow-100 text-yellow-700",
    bar: "bg-yellow-500",
    progress: "50%",
  },
  in_review: {
    label: "In Review",
    badge: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500",
    progress: "50%",
  },
  resolved: {
    label: "Resolved",
    badge: "bg-green-100 text-green-700",
    bar: "bg-green-500",
    progress: "100%",
  },
};

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getComplaints();
        setComplaints(res.complaints || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const initials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col">
      <NavBar />

      {/* ===== LIST ===== */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">View Complaints</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {complaints.map((c) => {
              const s = statusMap[c.status] || statusMap.received;

              return (
                <div
                  key={c._id}
                  onClick={() => setSelected(c)}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md cursor-pointer overflow-hidden"
                >
                  <img
                    src={c.image || "/placeholder.jpg"}
                    alt={c.title}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-4">
                    {/* Status + User */}
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${s.badge}`}
                      >
                        {s.label}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {initials(c.user?.name)}
                        </div>
                        <span className="text-xs text-gray-600">
                          {c.user?.name}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                      {c.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {c.description}
                    </p>

                    <div className="text-xs text-gray-500 flex items-center mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {c.address}
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{s.progress}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${s.bar}`}
                          style={{ width: s.progress }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex gap-4">
                        <span className="flex gap-1 items-center">
                          <ThumbsUp className="h-4 w-4" />
                          {c.upvotes || 0}
                        </span>
                        <span className="flex gap-1 items-center">
                          <ThumbsDown className="h-4 w-4" />
                          {c.downvotes || 0}
                        </span>
                      </div>

                      <span className="flex gap-1 items-center text-xs">
                        <Calendar className="h-3 w-3" />
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* ===== MODAL ===== */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full max-w-5xl rounded-xl shadow-lg relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-72 object-cover rounded-lg"
              />

              <div>
                <h2 className="text-xl font-bold mb-2">
                  {selected.title}
                </h2>

                <p className="text-gray-600 mb-4">
                  {selected.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4" />
                    {selected.address}
                  </div>

                  <div className="flex gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selected.createdAt)}
                  </div>

                  <div>
                    <strong>Priority:</strong> {selected.priority}
                  </div>

                  <div>
                    <strong>Type:</strong> {selected.type}
                  </div>

                  <div>
                    <strong>Nearby Landmark:</strong>{" "}
                    {selected.nearbyLandmark}
                  </div>

                  <div>
                    <strong>Coordinates:</strong>{" "}
                    {selected.location?.lat},{" "}
                    {selected.location?.lng}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== MAP ===== */}
            <div className="h-64 rounded-lg overflow-hidden">
              <MapContainer
                center={[
                  selected.location?.lat || 11.0168,
                  selected.location?.lng || 76.9558,
                ]}
                zoom={15}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="© OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selected.location?.lat &&
                  selected.location?.lng && (
                    <Marker
                      position={[
                        selected.location.lat,
                        selected.location.lng,
                      ]}
                    />
                  )}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;