import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardX, MapPin, Clock, Plus, Loader2 } from 'lucide-react';
import NavBar from '../Components/common/NavBar';
import Footer from '../Components/common/Footer';
import { getComplaints } from '../services/complaintService';

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
                        className="flex items-center gap-2 bg-[#F87171] hover:bg-[#EF4444] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> New Report
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {['all', 'received', 'in_review', 'resolved'].map(key => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${filter === key
                                ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-200'
                                : 'bg-white/50 text-gray-500 border-white/60 hover:border-teal-300 hover:text-teal-600'
                                }`}
                        >
                            {key === 'all' ? 'All' : key.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-10 w-10 text-teal-400 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl">
                        {error}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm p-16 text-center">
                        <ClipboardX className="h-12 w-12 text-teal-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-gray-800 mb-2">No complaints found</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((c, idx) => {
                            const s = statusStyles[c.status] || {};
                            const gradient = placeholderGradients[idx % placeholderGradients.length];

                            return (
                                <div
                                    key={c._id}
                                    onClick={() => setSelectedComplaint(c)}
                                    className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/70 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        {c.photo ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${c.photo}`}
                                                alt={c.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                                        )}
                                        <span className={`absolute top-3 left-3 text-[10px] font-black px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
                                            {s.label}
                                        </span>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-black text-gray-800 text-base mb-1 line-clamp-1">
                                            {c.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                            {c.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100/80">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-teal-400" />
                                                {c.address}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
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

            {/* Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
                        <button
                            onClick={() => setSelectedComplaint(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-black text-gray-800 mb-4">
                            {selectedComplaint.title}
                        </h2>

                        {selectedComplaint.photo && (
                            <img
                                src={`http://localhost:5000/uploads/${selectedComplaint.photo}`}
                                alt="complaint"
                                className="w-full h-64 object-cover rounded-xl mb-5"
                            />
                        )}

                        <div className="space-y-3 text-sm text-gray-700">
                            <p><strong>Status:</strong> {selectedComplaint.status}</p>
                            <p><strong>Description:</strong> {selectedComplaint.description}</p>
                            <p><strong>Address:</strong> {selectedComplaint.address}</p>
                            <p><strong>Reported on:</strong> {formatDate(selectedComplaint.createdAt)}</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ViewComplaints;
