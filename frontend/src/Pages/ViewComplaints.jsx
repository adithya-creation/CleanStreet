import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardX, MapPin, Clock, Plus, Loader2 } from 'lucide-react';
import NavBar from '../Components/common/NavBar';
import Footer from '../Components/common/Footer';
import { getComplaints, deleteComplaint, updateComplaint } from '../services/complaintService';

const statusStyles = {
    received: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Received' },
    in_review: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Review' },
    resolved: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Resolved' },
};

// Soft gradient placeholders when no photo is available
const placeholderGradients = [
    'from-rose-200 to-orange-200',
    'from-teal-200 to-cyan-200',
    'from-violet-200 to-indigo-200',
    'from-amber-200 to-yellow-100',
    'from-green-200 to-emerald-200',
];

const ViewComplaints = () => {
    const navigate = useNavigate();
    const handleDelete = async (id) => {
  if (!window.confirm('Delete this complaint?')) return;

  try {
    await deleteComplaint(id);
    setComplaints(prev => prev.filter(c => c._id !== id));
    setSelectedComplaint(null);
  } catch {
    alert('Failed to delete complaint');
  }
};
const [isEditing, setIsEditing] = useState(false);
const [editData, setEditData] = useState({
  title: '',
  description: '',
  priority: '',
  location: '',
});

const handleEdit = (complaint) => {
  navigate(`/edit-complaint/${complaint._id}`);
};
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getComplaints();
                setComplaints(data.complaints || []);
            } catch {
                setError('Failed to load complaints. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = filter === 'all'
        ? complaints
        : complaints.filter(c => c.status === filter);

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const getInitials = (name = '') =>
        name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

    const lat = selectedComplaint?.locationCoords?.coordinates?.[1];
const lng = selectedComplaint?.locationCoords?.coordinates?.[0];


    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2] font-sans flex flex-col">
            <NavBar />

            <div className="flex-1 max-w-7xl w-full mx-auto p-6 pt-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800">All Complaints</h1>
                        <p className="text-gray-500 mt-0.5">
                            {loading ? '...' : `${complaints.length} complaint${complaints.length !== 1 ? 's' : ''} reported`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/report')}
                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-teal-200 transition-all hover:scale-[1.02] active:scale-95 self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" /> New Report
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'received', label: 'Received' },
                        { key: 'in_review', label: 'In Review' },
                        { key: 'resolved', label: 'Resolved' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${filter === key
                                ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-200'
                                : 'bg-white/50 text-gray-500 border-white/60 hover:border-teal-300 hover:text-teal-600'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-10 w-10 text-teal-400 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 font-medium text-sm px-6 py-4 rounded-2xl">
                        {error}
                    </div>
                ) : filtered.length === 0 ? (
                    /* Empty state */
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm p-16 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center mb-6">
                            <ClipboardX className="h-10 w-10 text-teal-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">No complaints found</h3>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            {filter === 'all'
                                ? 'No complaints have been reported yet. Be the first to make a difference!'
                                : `No complaints with status "${filter.replace('_', ' ')}".`}
                        </p>
                        {filter === 'all' && (
                            <button
                                onClick={() => navigate('/report')}
                                className="bg-[#F87171] hover:bg-[#EF4444] text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-[1.03]"
                            >
                                Report an Issue
                            </button>
                        )}
                    </div>
                ) : (
                    /* ── Tile grid ── */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((c, idx) => {
                            const s = statusStyles[c.status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: c.status };
                            const gradient = placeholderGradients[idx % placeholderGradients.length];
                            return (
                                 <div key={c._id} onClick={() => setSelectedComplaint(c)} className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/70 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col"
  >
                                    {/* ── Photo / placeholder ── */}
                                    <div className="relative h-44 overflow-hidden shrink-0">
                                        {c.photo ? (
                                            <img
                                                src={c.photo}
                                                alt={c.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                                                <MapPin className="h-10 w-10 text-white/50" />
                                            </div>
                                        )}

                                        {/* Status badge — top left */}
                                        <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${s.bg} ${s.text}`}>
                                            {s.label}
                                        </span>

                                        {/* User pill — top right */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full pl-1 pr-2.5 py-1 shadow-sm">
                                            <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white text-[8px] font-black shrink-0">
                                                {getInitials(c.user?.name)}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-700 leading-none max-w-[80px] truncate">
                                                {c.user?.name || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── Card body ── */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-black text-gray-800 text-base mb-1 line-clamp-1 leading-snug">
                                            {c.title}
                                        </h3>
                                        {c.description && (
                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                                                {c.description}
                                            </p>
                                        )}

                                        {/* Footer row */}
                                        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100/80">
                                            {c.address ? (
                                                <span className="flex items-center gap-1 truncate max-w-[65%]">
                                                    <MapPin className="h-3 w-3 shrink-0 text-teal-400" />
                                                    <span className="truncate">{c.address}</span>
                                                </span>
                                            ) : <span />}
                                            <span className="flex items-center gap-1 shrink-0 ml-2">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(c.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex justify-end gap-3 p-3">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setSelectedComplaint(c);     // open modal
      setIsEditing(true);          // enable edit
      setEditData({
        title: c.title,
        description: c.description,
        priority: c.priority,
        location: c.location,
      });
    }}
    className="text-amber-600 font-bold text-sm cursor-pointer hover:text-amber-800 hover:scale-105 transition-all"
  >
    Edit
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDelete(c._id);
    }}
    className="text-red-600 font-bold text-sm cursor-pointer hover:text-red-800 hover:scale-105 transition-all"
  >
    Delete
  </button>
</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
              {selectedComplaint && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-xl w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto relative">
      
      <div className="p-1 pr-10 flex justify-end gap-2">
  <button
  onClick={(e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditData({
      title: selectedComplaint.title,
      description: selectedComplaint.description,
      priority: selectedComplaint.priority,
      location: selectedComplaint.location,
    });
  }}
  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-blue-200 hover:scale-105 transition-transform"
>
  Edit
</button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDelete(selectedComplaint._id);
    }}
    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-bold cursor-pointer hover:bg-red-200 hover:scale-105 transition-transform"
  >
    Delete
  </button>
</div>

      {/* Close button */}
      <button
        onClick={() => setSelectedComplaint(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
      >
        ✕
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

        {/* LEFT — Image */}
        <div className="rounded-2xl overflow-hidden border">
          {selectedComplaint.photo ? (
            <img
              src={selectedComplaint.photo}
              alt={selectedComplaint.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* RIGHT — Details */}
        <div className="space-y-4">
       <div className="space-y-1">
  <label>
   <p><strong>Title</strong></p>
  </label>

  {isEditing ? (
    <input
      className="w-full border rounded-lg px-4 py-2 text-lg font-bold"
      value={editData.title}
      onChange={(e) =>
        setEditData({ ...editData, title: e.target.value })
      }
    />
  ) : (
    <p className="text-xl font-black text-gray-800">
      {selectedComplaint.title}
    </p>
  )}
</div>
        <div className="space-y-1">
  <label>
  <p><strong>Description</strong></p>
  </label>

  {isEditing ? (
    <textarea
      rows={4}
      className="w-full border rounded-lg px-4 py-2"
      value={editData.description}
      onChange={(e) =>
        setEditData({ ...editData, description: e.target.value })
      }
    />
  ) : (
    <p className="text-gray-700">
      {selectedComplaint.description}
    </p>
  )}
</div>

          <div className="space-y-2 text-sm">
           <div className="space-y-1">
  <label>
    <p><strong> Type</strong></p>
   </label>

  {isEditing ? (
    <select
      className="w-full border rounded-lg px-4 py-2"
      value={editData.type}
      onChange={(e) =>
        setEditData({ ...editData, type: e.target.value })
      }
    >
      <option value="Waste / Garbage">Waste / Garbage</option>
      <option value="Drainage">Drainage</option>
      <option value="Road Damage">Road Damage</option>
      <option value="Street Light">Street Light</option>
      <option value="Water Supply">Water Supply</option>
      <option value="Other">Other</option>
    </select>
  ) : (
    <p className="text-gray-800">
      {selectedComplaint.type}
    </p>
  )}
</div>
            <p>
              <strong>Status:</strong>{' '}
              <span className="capitalize">{selectedComplaint.status}</span>
            </p>
          <div className="space-y-1">
  <label>
    <p><strong>Priority</strong></p>
  </label>

  {isEditing ? (
    <select
      className="border rounded-lg px-4 py-2"
      value={editData.priority}
      onChange={(e) =>
        setEditData({ ...editData, priority: e.target.value })
      }
    >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  ) : (
    <p className="text-gray-800">
      {selectedComplaint.priority}
    </p>
  )}
</div>
          <div className="space-y-1">
  <label>
   <p> <strong>
    Address</strong></p>
  </label>

  {isEditing ? (
    <input
      className="w-full border rounded-lg px-4 py-2"
      value={editData.address}
      onChange={(e) =>
        setEditData({ ...editData, address: e.target.value })
      }
    />
  ) : (
    <p className="text-gray-800">
      {selectedComplaint.address}
    </p>
  )}
</div>
            <p><strong>Reported On:</strong> {formatDate(selectedComplaint.createdAt)}</p>
          </div>

        <div className="h-48 rounded-xl overflow-hidden border relative">
  {lat && lng ? (
    <>
      <iframe
        title="map"
        className="w-full h-full"
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?marker=${lat},${lng}&zoom=16`}
      />
      {isEditing && (
        // Transparent overlay to capture clicks
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={async () => {
            // Use reverse geocoding to fetch address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            setEditData({ ...editData, address: data.display_name || '' });
          }}
        />
      )}
    </>
  ) : (
    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
      Location not available
    </div>
  )}

  
</div>
{isEditing && (
  <div className="flex gap-3 mt-4">
    {/* SAVE */}
    <button
      onClick={async (e) => {
        e.stopPropagation();
        await updateComplaint(selectedComplaint._id, editData);

        setComplaints((prev) =>
          prev.map((c) =>
            c._id === selectedComplaint._id
              ? { ...c, ...editData }
              : c
          )
        );

        setSelectedComplaint((prev) => ({
          ...prev,
          ...editData,
        }));

        setIsEditing(false);
      }}
      className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold"
    >
      Save
    </button>

    {/* CANCEL */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(false);
      }}
      className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-bold"
    >
      Cancel
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  </div>
)}

            <Footer />
        </div>
    );
};

export default ViewComplaints;
