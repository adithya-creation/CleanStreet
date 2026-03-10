import React, { useEffect, useState } from "react";
import NavBar from "../Components/common/NavBar";
import Footer from "../Components/common/Footer";
import { getAllComplaints, updateComplaintStatus, deleteComplaint, assignVolunteer } from "../services/complaintService";
import { getAllUsers, updateUserRole, deleteUser } from "../services/authService";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


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
    const [showReportBox, setShowReportBox] = useState(false);

    // Edit role state
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingRole, setEditingRole] = useState("");
    const [roleLoading, setRoleLoading] = useState(false);

    // Delete user state
    const [deleteTarget, setDeleteTarget] = useState(null); // { _id, name }

    // Edit complaint status state
    const [editingComplaintId, setEditingComplaintId] = useState(null);
    const [editingStatus, setEditingStatus] = useState("");
    const [editingAssignedTo, setEditingAssignedTo] = useState(""); // volunteer id or "" for unassigned
    const [statusLoading, setStatusLoading] = useState(false);

    // Delete complaint state
    const [deleteComplaintTarget, setDeleteComplaintTarget] = useState(null);

    // Assign volunteer state
    const [assignTarget, setAssignTarget] = useState(null); // complaint object
    const [selectedVolunteer, setSelectedVolunteer] = useState("");
    const [assignLoading, setAssignLoading] = useState(false); // { _id, title }

    // Activity log state
    const [activityLogs, setActivityLogs] = useState([]);
    const [activityLimit, setActivityLimit] = useState("10");
    const [activityLoading, setActivityLoading] = useState(false);

    // Role change block popup
    const [roleErrorModal, setRoleErrorModal] = useState(null); // { message, reason }

    useEffect(() => { fetchData(); }, []);

    // Fetch logs whenever tab becomes active or limit changes
    useEffect(() => {
        if (activeTab === "activity") fetchActivityLogs();
    }, [activeTab, activityLimit]);

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

    const fetchActivityLogs = async () => {
        setActivityLoading(true);
        try {
            const res = await api.get(`/admin/activity-logs?limit=${activityLimit}`);
            if (res.data.success) setActivityLogs(res.data.logs || []);
        } catch (e) {
            console.error("Activity logs fetch error:", e);
        } finally {
            setActivityLoading(false);
        }
    };

    const handleSaveRole = async (userId) => {
        setRoleLoading(true);
        try {
            const updated = await updateUserRole(userId, editingRole);
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: updated.role } : u));
            setEditingUserId(null);
        } catch (e) {
            // Show a descriptive popup if the backend blocked the role change
            const data = e?.response?.data;
            if (data?.blocked) {
                setRoleErrorModal({ message: data.message, reason: data.reason });
                setEditingUserId(null); // close the edit inline
            } else {
                console.error(e);
            }
        } finally {
            setRoleLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteTarget) return;
        try {
            await deleteUser(deleteTarget._id);
            setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
        } catch (e) {
            console.error(e);
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleSaveStatus = async (complaintId) => {
        setStatusLoading(true);
        try {
            // Save status change
            await updateComplaintStatus(complaintId, editingStatus);

            // Save volunteer reassignment if it changed
            const original = complaints.find(c => c._id === complaintId);
            const originalVolId = original?.assignedTo?._id || "";
            if (editingAssignedTo !== originalVolId) {
                // Call assign endpoint — empty string triggers unassign on backend
                const updated = await assignVolunteer(complaintId, editingAssignedTo);
                setComplaints(prev => prev.map(c =>
                    c._id === complaintId
                        ? { ...c, status: updated.status ?? editingStatus, assignedTo: updated.assignedTo ?? null }
                        : c
                ));
            } else {
                setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: editingStatus } : c));
            }

            setEditingComplaintId(null);
        } catch (e) {
            console.error(e);
        } finally {
            setStatusLoading(false);
        }
    };

    const handleDeleteComplaint = async () => {
        if (!deleteComplaintTarget) return;
        try {
            await deleteComplaint(deleteComplaintTarget._id);
            setComplaints(prev => prev.filter(c => c._id !== deleteComplaintTarget._id));
        } catch (e) {
            console.error(e);
        } finally {
            setDeleteComplaintTarget(null);
        }
    };

    const handleAssignVolunteer = async () => {
        if (!assignTarget || !selectedVolunteer) return;
        setAssignLoading(true);
        try {
            const updated = await assignVolunteer(assignTarget._id, selectedVolunteer);
            setComplaints(prev => prev.map(c =>
                c._id === assignTarget._id
                    ? { ...c, assignedTo: updated.assignedTo, status: updated.status }
                    : c
            ));
            setAssignTarget(null);
            setSelectedVolunteer("");
        } catch (e) {
            console.error(e);
        } finally {
            setAssignLoading(false);
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
    const locations = [...new Set(complaints.map(c => c.address).filter(Boolean))];
    const filteredByLocation = locationFilter === "all" ? filteredComplaints : filteredComplaints.filter(c => c.address === locationFilter);

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

        /* REPORT FUNCTIONS */

        const downloadPDF = () => {

            const doc = new jsPDF();

            doc.text("Complaints Report", 14, 15);

            const rows = complaints.map(c => [
                c.title,
                c.user?.name || "Unknown",
                c.address || "N/A",
                c.type || "Other",
                c.status,
                c.assignedTo?.name || "-",
                c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""
            ]);

            autoTable(doc,{
                head:[["Title","Reported By","Location","Type","Status","Assigned To","Date"]],
                body:rows,
                startY:25
            });

            doc.save("complaints_report.pdf");

            setShowReportBox(false);
        };

        const downloadExcel = () => {

            const data = complaints.map(c => ({
                Title: c.title,
                ReportedBy: c.user?.name || "Unknown",
                Location: c.address || "N/A",
                Type: c.type || "Other",
                Status: c.status,
                AssignedTo: c.assignedTo?.name || "-",
                Date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints");

            const excelBuffer = XLSX.write(workbook,{
                bookType:"xlsx",
                type:"array"
            });

            const fileData = new Blob([excelBuffer],{
                type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            saveAs(fileData,"complaints_report.xlsx");

            setShowReportBox(false);
        };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2] flex flex-col">

            <NavBar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

                {/* header */}
                <div className="mb-8 flex items-center">

                    <div>
                        <h1 className="text-4xl font-black text-gray-800 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">
                            Full platform overview & management
                        </p>
                    </div>

                    <button
                        onClick={() => setShowReportBox(true)}
                        className="ml-auto bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-bold"
                    >
                        Download Report
                    </button>

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
                                            <td className="px-4 py-4">
                                                {editingUserId === user._id ? (
                                                    <select
                                                        value={editingRole}
                                                        onChange={e => setEditingRole(e.target.value)}
                                                        className="text-xs font-bold px-2 py-1 rounded-lg border border-teal-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="volunteer">Volunteer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                ) : (
                                                    <RoleBadge role={user.role} />
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">{user.location || "N/A"}</td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {editingUserId === user._id ? (
                                                        <>
                                                            <button
                                                                onClick={() => setEditingUserId(null)}
                                                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
                                                            >
                                                                ✗ Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleSaveRole(user._id)}
                                                                disabled={roleLoading}
                                                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-all disabled:opacity-60"
                                                            >
                                                                {roleLoading ? "Saving…" : "✓ Save"}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Admins cannot have their role changed */}
                                                            {user.role !== "admin" && (
                                                                <ActionBtn color="teal" onClick={() => { setEditingUserId(user._id); setEditingRole(user.role); }}>Edit</ActionBtn>
                                                            )}
                                                            <ActionBtn color="red" onClick={() => setDeleteTarget(user)}>Delete</ActionBtn>
                                                        </>
                                                    )}
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

                {/* ─── DELETE CONFIRMATION MODAL ─────────────────────────── */}
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* backdrop */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                        {/* modal */}
                        <div className="relative bg-white rounded-3xl shadow-2xl px-10 py-8 max-w-sm w-full mx-4">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-3xl">🗑️</div>
                                <h3 className="text-xl font-black text-gray-800">Delete User</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Are you sure you want to delete&nbsp;
                                    <span className="font-bold text-gray-700">{deleteTarget.name}</span>?
                                    <br />This action cannot be undone.
                                </p>
                                <div className="flex gap-3 mt-2 w-full">
                                    <button
                                        onClick={() => setDeleteTarget(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteUser}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all"
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── ROLE CHANGE BLOCKED MODAL ─────────────────────────── */}
                {roleErrorModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRoleErrorModal(null)} />
                        <div className="relative bg-white rounded-3xl shadow-2xl px-10 py-8 max-w-md w-full mx-4">
                            <div className="flex flex-col items-center text-center gap-4">
                                {/* icon — different per reason */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${roleErrorModal.reason === 'has_complaints' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                                    {roleErrorModal.reason === 'has_complaints' ? '📋' : '👤'}
                                </div>
                                <h3 className="text-xl font-black text-gray-800">Role Change Blocked</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {roleErrorModal.message}
                                </p>
                                {roleErrorModal.reason === 'has_complaints' && (
                                    <div className="w-full bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 text-left">
                                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">How to fix</p>
                                        <p className="text-sm text-orange-700">Go to <span className="font-bold">View Complaints</span>, filter by this user, and delete their complaints. Then retry the role change.</p>
                                    </div>
                                )}
                                {roleErrorModal.reason === 'is_assigned' && (
                                    <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 text-left">
                                        <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">How to fix</p>
                                        <p className="text-sm text-yellow-700">Go to <span className="font-bold">View Complaints</span>, find complaints assigned to this volunteer, and reassign them or wait for resolution. Then retry the role change.</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setRoleErrorModal(null)}
                                    className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-sm transition-all mt-1"
                                >
                                    Got it
                                </button>
                            </div>
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
                                            <td className="px-4 py-4 text-gray-500 text-sm">{c.user?.name || "Unknown"}</td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">{c.address || "N/A"}</td>
                                            <td className="px-4 py-4 text-gray-600 text-sm">{c.type || "Other"}</td>
                                            <td className="px-4 py-4">
                                                {editingComplaintId === c._id ? (
                                                    <select
                                                        value={editingStatus}
                                                        onChange={e => setEditingStatus(e.target.value)}
                                                        className="text-xs font-bold px-2 py-1 rounded-lg border border-teal-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
                                                    >
                                                        <option value="received">Pending</option>
                                                        <option value="in_review">In Review</option>
                                                        <option value="resolved">Resolved</option>
                                                    </select>
                                                ) : (
                                                    <StatusBadge status={c.status} />
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">
                                                {editingComplaintId === c._id ? (
                                                    <select
                                                        value={editingAssignedTo}
                                                        onChange={e => setEditingAssignedTo(e.target.value)}
                                                        className="text-xs font-bold px-2 py-1 rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 max-w-[130px]"
                                                    >
                                                        <option value="">— Unassigned —</option>
                                                        {users.filter(u => u.role === "volunteer").map(v => (
                                                            <option key={v._id} value={v._id}>{v.name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    c.assignedTo?.name
                                                        ? <span className="font-medium text-gray-700">{c.assignedTo.name}</span>
                                                        : <button
                                                            onClick={() => { setAssignTarget(c); setSelectedVolunteer(""); }}
                                                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-all"
                                                        >Assign</button>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-gray-500 text-sm">
                                                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {editingComplaintId === c._id ? (
                                                        <>
                                                            <button
                                                                onClick={() => setEditingComplaintId(null)}
                                                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
                                                            >
                                                                ✗ Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleSaveStatus(c._id)}
                                                                disabled={statusLoading}
                                                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-all disabled:opacity-60"
                                                            >
                                                                {statusLoading ? "Saving…" : "✓ Save"}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ActionBtn color="teal" onClick={() => { setEditingComplaintId(c._id); setEditingStatus(c.status); setEditingAssignedTo(c.assignedTo?._id || ""); }}>Edit</ActionBtn>
                                                            <ActionBtn color="red" onClick={() => setDeleteComplaintTarget(c)}>Delete</ActionBtn>
                                                        </>
                                                    )}
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

                {/* ─── DELETE COMPLAINT MODAL ─────────────────────────── */}
                {deleteComplaintTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteComplaintTarget(null)} />
                        <div className="relative bg-white rounded-3xl shadow-2xl px-10 py-8 max-w-sm w-full mx-4">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-3xl">🗑️</div>
                                <h3 className="text-xl font-black text-gray-800">Delete Complaint</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Are you sure you want to delete&nbsp;
                                    <span className="font-bold text-gray-700">"{deleteComplaintTarget.title}"</span>?
                                    <br />This action cannot be undone.
                                </p>
                                <div className="flex gap-3 mt-2 w-full">
                                    <button
                                        onClick={() => setDeleteComplaintTarget(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteComplaint}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all"
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── ASSIGN VOLUNTEER MODAL ─────────────────────────────── */}
                {assignTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAssignTarget(null)} />
                        <div className="relative bg-white rounded-3xl shadow-2xl px-10 py-8 max-w-sm w-full mx-4">
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">👤</div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-800">Assign Volunteer</h3>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{assignTarget.title}</p>
                                    </div>
                                </div>
                                {/* Volunteer list with location */}
                                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                                    {users.filter(u => u.role === "volunteer").length === 0 && (
                                        <p className="text-sm text-gray-400 text-center py-4">No volunteers found.</p>
                                    )}
                                    {users.filter(u => u.role === "volunteer").map(v => (
                                        <button
                                            key={v._id}
                                            type="button"
                                            onClick={() => setSelectedVolunteer(v._id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${selectedVolunteer === v._id
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-100 bg-gray-50 hover:border-indigo-200"
                                                }`}
                                        >
                                            <p className="text-sm font-bold text-gray-800">{v.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                📍 {v.location || "No location set"}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setAssignTarget(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAssignVolunteer}
                                        disabled={!selectedVolunteer || assignLoading}
                                        className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-all disabled:opacity-50"
                                    >
                                        {assignLoading ? "Assigning…" : "Assign"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── RECENT ACTIVITY ──────────────────────────────────────── */}
                {activeTab === "activity" && (
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 overflow-hidden">

                        {/* header */}
                        <div className="px-8 py-6 border-b border-white/60 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-black text-gray-800">Recent Activities</h2>
                                <p className="text-gray-400 text-sm mt-0.5">All platform events — complaints, users, roles &amp; more</p>
                            </div>
                            {/* limit selector */}
                            <FilterSelect value={activityLimit} onChange={e => setActivityLimit(e.target.value)}>
                                <option value="10">Latest 10</option>
                                <option value="20">Latest 20</option>
                                <option value="all">All</option>
                            </FilterSelect>
                        </div>

                        {/* log list */}
                        {activityLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : activityLogs.length === 0 ? (
                            <p className="text-center text-gray-400 py-12 font-medium">No activity recorded yet.</p>
                        ) : (
                            <ul className="divide-y divide-white/60">
                                {activityLogs.map((log) => {
                                    // colour + icon per activity type
                                    const typeMap = {
                                        complaint_created: { bg: "bg-teal-100", text: "text-teal-600", icon: "📋", label: "New Complaint" },
                                        status_changed: { bg: "bg-blue-100", text: "text-blue-600", icon: "🔄", label: "Status Changed" },
                                        volunteer_assigned: { bg: "bg-indigo-100", text: "text-indigo-600", icon: "👤", label: "Volunteer Assigned" },
                                        volunteer_accepted: { bg: "bg-cyan-100", text: "text-cyan-600", icon: "✅", label: "Volunteer Accepted" },
                                        volunteer_rejected: { bg: "bg-orange-100", text: "text-orange-500", icon: "↩️", label: "Volunteer Rejected" },
                                        complaint_resolved: { bg: "bg-emerald-100", text: "text-emerald-600", icon: "🏁", label: "Complaint Resolved" },
                                        complaint_deleted: { bg: "bg-red-100", text: "text-red-500", icon: "🗑️", label: "Complaint Deleted" },
                                        complaint_edited: { bg: "bg-yellow-100", text: "text-yellow-600", icon: "✏️", label: "Complaint Edited" },
                                        role_changed: { bg: "bg-purple-100", text: "text-purple-600", icon: "🛡️", label: "Role Changed" },
                                        user_deleted: { bg: "bg-red-100", text: "text-red-500", icon: "🗑️", label: "User Deleted" },
                                    };
                                    const t = typeMap[log.activityType] || { bg: "bg-gray-100", text: "text-gray-500", icon: "📌", label: log.activityType };

                                    return (
                                        <li key={log._id} className="px-8 py-5 flex items-start justify-between gap-4 hover:bg-white/30 transition-colors">
                                            <div className="flex items-start gap-4">
                                                {/* icon */}
                                                <div className={`w-10 h-10 rounded-2xl ${t.bg} flex items-center justify-center text-lg shrink-0`}>
                                                    {t.icon}
                                                </div>
                                                <div className="min-w-0">
                                                    {/* label badge */}
                                                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${t.bg} ${t.text} mb-1`}>
                                                        {t.label}
                                                    </span>
                                                    {/* main description */}
                                                    <p className="font-semibold text-gray-800 text-sm leading-snug">
                                                        <span className="text-teal-600">{log.actorName || "System"}</span>
                                                        {" → "}
                                                        <span className="text-gray-700">{log.targetName || "—"}</span>
                                                    </p>
                                                    {/* details */}
                                                    {log.details && (
                                                        <p className="text-xs text-gray-400 mt-0.5">{log.details}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* timestamp */}
                                            <p className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-1">
                                                {new Date(log.timestamp).toLocaleString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                    hour: "2-digit", minute: "2-digit"
                                                })}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}

            </div>
            {/* REPORT POPUP */}

            {showReportBox && (

                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl p-8 w-[300px] shadow-xl text-center">

                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            Select Report Format
                        </h3>

                        <div className="flex flex-col gap-3">

                            <button
                                onClick={downloadPDF}
                                className="bg-red-400 hover:bg-red-500 text-white py-2 rounded-lg font-semibold"
                            >
                                Download PDF
                            </button>

                            <button
                                onClick={downloadExcel}
                                className="bg-green-400 hover:bg-green-500 text-white py-2 rounded-lg font-semibold"
                            >
                                Download Excel
                            </button>

                            <button
                                onClick={() => setShowReportBox(false)}
                                className="text-gray-400 text-sm mt-2"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}



            <Footer />

        </div>
    );
};

export default AdminDashboard;
