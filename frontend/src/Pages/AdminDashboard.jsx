import React, { useEffect, useState } from "react";
import NavBar from "../Components/common/NavBar";
import Footer from "../Components/common/Footer";
import { getAllComplaints } from "../services/complaintService";
import { getAllUsers } from "../services/authService";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid
} from "recharts";

const COLORS = ["#14B8A6", "#F59E0B", "#EF4444", "#6366F1", "#8B5CF6"];

/* ─── helpers ────────────────────────────────────────────────── */

const RoleBadge = ({ role }) => {
    const map = {
        admin: "bg-purple-100 text-purple-700",
        volunteer: "bg-teal-100 text-teal-700",
        user: "bg-blue-100  text-blue-700",
    };
    return (
        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${map[role] || "bg-gray-100 text-gray-600"}`}>
            {role}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const map = {
        received: "bg-orange-100 text-orange-600",
        in_review: "bg-blue-100   text-blue-600",
        resolved: "bg-teal-100   text-teal-700",
    };
    const labels = {
        received: "Pending",
        in_review: "In Review",
        resolved: "Resolved",
    };
    return (
        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${map[status] || "bg-gray-100 text-gray-500"}`}>
            {labels[status] || status}
        </span>
    );
};

/* ─── stat card ──────────────────────────────────────────────── */

const StatCard = ({ label, val, accent }) => (
    <div className="bg-white/40 backdrop-blur-md p-8 rounded-[32px] shadow-sm border border-white/60 transition-all hover:border-teal-200 hover:shadow-md group">

        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 mb-3 group-hover:text-teal-500 transition-colors">
            {label}
        </p>
        <p className="text-6xl font-black text-gray-800 leading-none">{val}</p>
    </div>
);

/* ─── chart card ──────────────────────────────────────────────── */

const ChartCard = ({ title, children }) => (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 p-8">
        <h2 className="text-lg font-black text-gray-800 mb-6">{title}</h2>
        {children}
    </div>
);

/* ─── filter select ───────────────────────────────────────────── */

const FilterSelect = ({ value, onChange, children }) => (
    <select
        value={value}
        onChange={onChange}
        className="text-sm font-semibold text-gray-600 bg-white/60 border border-white/80 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 cursor-pointer"
    >
        {children}
    </select>
);

/* ─── action button ───────────────────────────────────────────── */

const ActionBtn = ({ children, color = "teal", onClick }) => {
    const colors = {
        teal: "bg-teal-500  hover:bg-teal-600  text-white",
        red: "bg-red-400   hover:bg-red-500   text-white",
        green: "bg-emerald-500 hover:bg-emerald-600 text-white",
    };
    return (
        <button
            onClick={onClick}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${colors[color]}`}
        >
            {children}
        </button>
    );
};

/* ─── main component ──────────────────────────────────────────── */

const AdminDashboard = () => {

    const [users, setUsers] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const userData = await getAllUsers();
            const complaintData = await getAllComplaints();
            setUsers(userData?.users || userData || []);
            setComplaints(complaintData?.complaints || complaintData || []);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    /* derived stats */
    const pending = complaints.filter(c => c.status === "received");
    const inReview = complaints.filter(c => c.status === "in_review");
    const resolved = complaints.filter(c => c.status === "resolved");

    const statusData = [
        { name: "Pending", value: pending.length },
        { name: "In Review", value: inReview.length },
        { name: "Resolved", value: resolved.length },
    ];

    const roleCounts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
    const roleData = Object.keys(roleCounts).map(r => ({ name: r, value: roleCounts[r] }));

    const typeCounts = complaints.reduce((acc, c) => { const t = c.type || "Other"; acc[t] = (acc[t] || 0) + 1; return acc; }, {});
    const typeData = Object.keys(typeCounts).map(t => ({ name: t, value: typeCounts[t] }));

    const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));

    const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(); date.setDate(date.getDate() - (6 - i));
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        const count = complaints.filter(c => new Date(c.createdAt).toDateString() === date.toDateString()).length;
        return { day, count };
    });

    const last30DaysUsers = Array.from({ length: 30 }).map((_, i) => {
        const date = new Date(); date.setDate(date.getDate() - (29 - i));
        const count = users.filter(u => new Date(u.createdAt).toDateString() === date.toDateString()).length;
        return { day: date.getDate(), count };
    });

    const monthCounts = {};
    complaints.forEach(c => { const m = new Date(c.createdAt).toLocaleString("default", { month: "short" }); monthCounts[m] = (monthCounts[m] || 0) + 1; });
    const monthlyData = Object.keys(monthCounts).map(m => ({ month: m, value: monthCounts[m] }));

    const filteredUsers = roleFilter === "all" ? users : users.filter(u => u.role === roleFilter);
    const filteredComplaints = statusFilter === "all" ? complaints : complaints.filter(c => c.status === statusFilter);
    const locations = [...new Set(complaints.map(c => c.location))];
    const filteredByLocation = locationFilter === "all" ? filteredComplaints : filteredComplaints.filter(c => c.location === locationFilter);

    const recentComplaints = [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    /* loading */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    /* nav tab button */
    const Tab = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`pb-3 font-bold text-sm transition-colors ${activeTab === id
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-400 hover:text-gray-600"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2] flex flex-col">

            <NavBar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

                {/* header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-800 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Full platform overview &amp; management</p>
                </div>

                {/* tab nav */}
                <div className="flex gap-8 mb-10 border-b border-white/60">
                    <Tab id="overview" label="Overview" />
                    <Tab id="users" label="Manage Users" />
                    <Tab id="complaints" label="View Complaints" />
                    <Tab id="activity" label="Recent Activities" />
                </div>

                {/* ── OVERVIEW ─────────────────────────────────────────────── */}
                {activeTab === "overview" && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            <StatCard label="Total Users" val={users.length} accent="#6366F1" />
                            <StatCard label="Total Complaints" val={complaints.length} accent="#F59E0B" />
                            <StatCard label="Pending" val={pending.length} accent="#EF4444" />
                            <StatCard label="Resolved" val={resolved.length} accent="#14B8A6" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">

                            <ChartCard title="Complaint Status Distribution">
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={statusData} dataKey="value" outerRadius={95} label>
                                            {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard title="Complaint Types">
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={typeData} dataKey="value" outerRadius={95} label>
                                            {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard title="User Roles">
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={roleData} dataKey="value" outerRadius={95} label>
                                            {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard title="Top 5 Complaint Types">
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart layout="vertical" data={topTypes}>
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#14B8A6" radius={[0, 6, 6, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard title="Complaints (Last 7 Days)">
                                <ResponsiveContainer width="100%" height={260}>
                                    <LineChart data={last7DaysData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#14B8A6" strokeWidth={2} dot={{ fill: "#14B8A6" }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard title="User Registrations (Last 30 Days)">
                                <ResponsiveContainer width="100%" height={260}>
                                    <LineChart data={last30DaysUsers}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} dot={{ fill: "#6366F1" }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            <ChartCard title="Monthly Complaint Trends">
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={monthlyData}>
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>

                        </div>
                    </>
                )}

                {/* ── USERS ────────────────────────────────────────────────── */}
                {activeTab === "users" && (
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 overflow-hidden">

                        {/* card header */}
                        <div className="px-8 py-6 border-b border-white/60 flex flex-wrap items-center justify-between gap-4">
                            <h2 className="text-xl font-black text-gray-800">All Users</h2>
                            <FilterSelect value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                                <option value="all">All Roles</option>
                                <option value="user">User</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="admin">Admin</option>
                            </FilterSelect>
                        </div>

                        {/* table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-teal-50/60 text-left text-xs font-black uppercase tracking-widest text-teal-700">
                                        <th className="px-8 py-4">Name</th>
                                        <th className="px-4 py-4">Email</th>
                                        <th className="px-4 py-4">Role</th>
                                        <th className="px-4 py-4">Location</th>
                                        <th className="px-4 py-4">Joined</th>
                                        <th className="px-4 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/60">
                                    {filteredUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-white/30 transition-colors">
                                            <td className="px-8 py-4 font-semibold text-gray-800">{user.name}</td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">{user.email}</td>
                                            <td className="px-4 py-4"><RoleBadge role={user.role} /></td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">{user.location || "N/A"}</td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2">
                                                    <ActionBtn color="teal">View</ActionBtn>
                                                    <ActionBtn color="red">Delete</ActionBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredUsers.length === 0 && (
                                <p className="text-center text-gray-400 py-10 font-medium">No users found.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── COMPLAINTS ───────────────────────────────────────────── */}
                {activeTab === "complaints" && (
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 overflow-hidden">

                        {/* card header */}
                        <div className="px-8 py-6 border-b border-white/60 flex flex-wrap items-center justify-between gap-4">
                            <h2 className="text-xl font-black text-gray-800">All Complaints</h2>
                            <div className="flex gap-3 flex-wrap">
                                <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                    <option value="all">All Status</option>
                                    <option value="received">Pending</option>
                                    <option value="in_review">In Review</option>
                                    <option value="resolved">Resolved</option>
                                </FilterSelect>
                                <FilterSelect value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                                    <option value="all">All Locations</option>
                                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </FilterSelect>
                            </div>
                        </div>

                        {/* table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-teal-50/60 text-left text-xs font-black uppercase tracking-widest text-teal-700">
                                        <th className="px-8 py-4">Title</th>
                                        <th className="px-4 py-4">Reported By</th>
                                        <th className="px-4 py-4">Location</th>
                                        <th className="px-4 py-4">Type</th>
                                        <th className="px-4 py-4">Status</th>
                                        <th className="px-4 py-4">Assigned To</th>
                                        <th className="px-4 py-4">Date</th>
                                        <th className="px-4 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/60">
                                    {filteredByLocation.map(c => (
                                        <tr key={c._id} className="hover:bg-white/30 transition-colors">
                                            <td className="px-8 py-4 font-semibold text-gray-800">{c.title}</td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">{c.reportedBy?.name || "Unknown"}</td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">{c.location || "N/A"}</td>
                                            <td className="px-4 py-4 text-gray-600 text-sm">{c.type || "Other"}</td>
                                            <td className="px-4 py-4"><StatusBadge status={c.status} /></td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">{c.assignedTo?.name || <span className="text-gray-300">—</span>}</td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">
                                                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2">
                                                    <ActionBtn color="teal">View</ActionBtn>
                                                    <ActionBtn color="green">Assign</ActionBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredByLocation.length === 0 && (
                                <p className="text-center text-gray-400 py-10 font-medium">No complaints found.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── RECENT ACTIVITY ──────────────────────────────────────── */}
                {activeTab === "activity" && (
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 overflow-hidden">

                        <div className="px-8 py-6 border-b border-white/60">
                            <h2 className="text-xl font-black text-gray-800">Recent Complaints</h2>
                            <p className="text-gray-400 text-sm mt-0.5">Latest 5 submitted issues</p>
                        </div>

                        <ul className="divide-y divide-white/60">
                            {recentComplaints.map((c, i) => (
                                <li key={c._id} className="px-8 py-5 flex items-center justify-between gap-4 hover:bg-white/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        {/* timeline dot */}
                                        <div className="w-9 h-9 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 font-black text-sm shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{c.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}
                                                {c.location ? ` · ${c.location}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={c.status} />
                                </li>
                            ))}

                            {recentComplaints.length === 0 && (
                                <p className="text-center text-gray-400 py-10 font-medium">No recent activity.</p>
                            )}
                        </ul>
                    </div>
                )}

            </div>

            <Footer />

        </div>
    );
};

export default AdminDashboard;
