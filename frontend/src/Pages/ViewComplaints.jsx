import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardX, MapPin, Clock, ChevronRight, Plus, Loader2 } from 'lucide-react';
import NavBar from '../Components/common/NavBar';
import Footer from '../Components/common/Footer';
import { getComplaints } from '../services/complaintService';

const statusStyles = {
    received: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Received' },
    in_review: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'In Review' },
    resolved: { bg: 'bg-teal-50', text: 'text-teal-600', label: 'Resolved' },
};

const ViewComplaints = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

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

            <div className="flex-1 max-w-5xl w-full mx-auto p-6 pt-10">

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
                        className="flex items-center gap-2 bg-[#F87171] hover:bg-[#EF4444] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-[1.02] active:scale-95 self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" /> New Report
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
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
                    /* Complaints list */
                    <div className="space-y-3">
                        {filtered.map((c) => {
                            const s = statusStyles[c.status] || { bg: 'bg-gray-50', text: 'text-gray-500', label: c.status };
                            return (
                                <div
                                    key={c._id}
                                    className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm px-6 py-5 flex items-center justify-between gap-4 hover:border-teal-200 hover:shadow-md transition-all group cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h3 className="font-bold text-gray-800 text-base truncate">{c.title}</h3>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                                            {c.address && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {c.address}
                                                </span>
                                            )}
                                            {c.user?.name && (
                                                <span className="flex items-center gap-1">
                                                    <span>By</span> <span className="font-semibold text-gray-500">{c.user.name}</span>
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {formatDate(c.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-teal-400 transition-colors shrink-0" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ViewComplaints;
