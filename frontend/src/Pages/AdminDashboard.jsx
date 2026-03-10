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

const AdminDashboard = () => {

const [users,setUsers] = useState([]);
const [complaints,setComplaints] = useState([]);
const [loading,setLoading] = useState(true);
const [activeTab,setActiveTab] = useState("overview");
const [roleFilter,setRoleFilter] = useState("all");
const [statusFilter,setStatusFilter] = useState("all");
const [locationFilter,setLocationFilter] = useState("all");

useEffect(()=>{
 fetchData();
},[])

const fetchData = async ()=>{
 try{

 const userData = await getAllUsers();
 const complaintData = await getAllComplaints();

 setUsers(userData?.users || userData || []);
 setComplaints(complaintData?.complaints || complaintData || []);

 }catch(e){
 console.log(e)
 }finally{
 setLoading(false)
 }
}

/* STATUS */

const pending = complaints.filter(c=>c.status === "received");
const inReview = complaints.filter(c=>c.status === "in_review");
const resolved = complaints.filter(c=>c.status === "resolved");

const statusData = [
 {name:"Pending", value:pending.length},
 {name:"In Review", value:inReview.length},
 {name:"Resolved", value:resolved.length}
];

/* USER ROLES */

const roleCounts = users.reduce((acc,user)=>{
 acc[user.role] = (acc[user.role] || 0) + 1;
 return acc;
},{});

const roleData = Object.keys(roleCounts).map(role=>({
 name:role,
 value:roleCounts[role]
}));

/* COMPLAINT TYPES */

const typeCounts = complaints.reduce((acc,c)=>{
 const type = c.type || "Other";
 acc[type] = (acc[type] || 0) + 1;
 return acc;
},{});

const typeData = Object.keys(typeCounts).map(type=>({
 name:type,
 value:typeCounts[type]
}));

/* TOP TYPES */

const topTypes = Object.entries(typeCounts)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)
.map(([type,count])=>({
 name:type,
 value:count
}));

/* LAST 7 DAYS */

const last7DaysData = Array.from({length:7}).map((_,i)=>{
 const date = new Date();
 date.setDate(date.getDate() - (6-i));

 const day = date.toLocaleDateString("en-US",{weekday:"short"});

 const count = complaints.filter(c=>{
 const d = new Date(c.createdAt);
 return d.toDateString() === date.toDateString();
 }).length;

 return {day,count};
});

/* LAST 30 DAYS USERS */

const last30DaysUsers = Array.from({length:30}).map((_,i)=>{
 const date = new Date();
 date.setDate(date.getDate() - (29-i));

 const count = users.filter(u=>{
 const d = new Date(u.createdAt);
 return d.toDateString() === date.toDateString();
 }).length;

 return {
 day:date.getDate(),
 count
 }
});

/* MONTHLY */

const monthCounts = {};

complaints.forEach(c=>{
 const month = new Date(c.createdAt).toLocaleString("default",{month:"short"});
 monthCounts[month] = (monthCounts[month] || 0) + 1;
});

const monthlyData = Object.keys(monthCounts).map(m=>({
 month:m,
 value:monthCounts[m]
}));

/* FILTER USERS */

const filteredUsers =
roleFilter === "all"
? users
: users.filter(u => u.role === roleFilter);

/* FILTER COMPLAINTS */

const filteredComplaints =
statusFilter === "all"
? complaints
: complaints.filter(c => c.status === statusFilter);

/* LOCATIONS */

const locations = [...new Set(complaints.map(c => c.location))];

const filteredByLocation =
locationFilter === "all"
? filteredComplaints
: filteredComplaints.filter(c => c.location === locationFilter);

/* RECENT ACTIVITIES */

const recentComplaints =
[...complaints]
.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
.slice(0,5);

const getStatusColor = (status) => {

if(status === "resolved") return "green";
if(status === "in_review") return "blue";

return "orange";

};

if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <p className="text-xl font-semibold">Loading dashboard...</p>
 </div>
 );
}

return(

<div className="min-h-screen bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2] flex flex-col">

<NavBar/>

<div className="flex-1 max-w-7xl mx-auto w-full p-8">

<h1 className="text-4xl font-black mb-8">
Admin Dashboard
</h1>

{/* MENU */}

<div className="flex gap-8 border-b mb-10">

<button
onClick={()=>setActiveTab("overview")}
className={`pb-3 font-semibold ${activeTab==="overview" ? "border-b-2 border-teal-500 text-teal-600":"text-gray-500"}`}
>
Overview
</button>

<button
onClick={()=>setActiveTab("users")}
className={`pb-3 font-semibold ${activeTab==="users" ? "border-b-2 border-teal-500 text-teal-600":"text-gray-500"}`}
>
Manage Users
</button>

<button
onClick={()=>setActiveTab("complaints")}
className={`pb-3 font-semibold ${activeTab==="complaints" ? "border-b-2 border-teal-500 text-teal-600":"text-gray-500"}`}
>
View Complaints
</button>

<button
onClick={()=>setActiveTab("activity")}
className={`pb-3 font-semibold ${activeTab==="activity" ? "border-b-2 border-teal-500 text-teal-600":"text-gray-500"}`}
>
Recent Activities
</button>

</div>

{/* OVERVIEW */}

{activeTab === "overview" && (

<>

<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">

<StatCard label="Total Users" val={users.length}/>
<StatCard label="Total Complaints" val={complaints.length}/>
<StatCard label="Pending Complaints" val={pending.length}/>
<StatCard label="Resolved Complaints" val={resolved.length}/>

</div>

<div className="grid md:grid-cols-2 gap-10 mb-16">

<ChartCard title="Complaint Status Distribution">
<ResponsiveContainer width="100%" height={300}>
<PieChart>
<Pie data={statusData} dataKey="value" outerRadius={100} label>
{statusData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]}/>
))}
</Pie>
<Tooltip/>
</PieChart>
</ResponsiveContainer>
</ChartCard>

<ChartCard title="Complaint Types">
<ResponsiveContainer width="100%" height={300}>
<PieChart>
<Pie data={typeData} dataKey="value" outerRadius={100} label>
{typeData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]}/>
))}
</Pie>
<Tooltip/>
</PieChart>
</ResponsiveContainer>
</ChartCard>

<ChartCard title="User Roles">
<ResponsiveContainer width="100%" height={300}>
<PieChart>
<Pie data={roleData} dataKey="value" outerRadius={100} label>
{roleData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]}/>
))}
</Pie>
<Tooltip/>
</PieChart>
</ResponsiveContainer>
</ChartCard>

<ChartCard title="Top 5 Complaint Types">
<ResponsiveContainer width="100%" height={300}>
<BarChart layout="vertical" data={topTypes}>
<XAxis type="number"/>
<YAxis type="category" dataKey="name"/>
<Tooltip/>
<Bar dataKey="value" fill="#14B8A6"/>
</BarChart>
</ResponsiveContainer>
</ChartCard>

<ChartCard title="Complaints (Last 7 Days)">
<ResponsiveContainer width="100%" height={300}>
<LineChart data={last7DaysData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="day"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="count" stroke="#14B8A6"/>
</LineChart>
</ResponsiveContainer>
</ChartCard>

<ChartCard title="User Registrations (Last 30 Days)">
<ResponsiveContainer width="100%" height={300}>
<LineChart data={last30DaysUsers}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="day"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="count" stroke="#6366F1"/>
</LineChart>
</ResponsiveContainer>
</ChartCard>

<ChartCard title="Monthly Complaint Trends">
<ResponsiveContainer width="100%" height={300}>
<BarChart data={monthlyData}>
<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="value" fill="#F59E0B"/>
</BarChart>
</ResponsiveContainer>
</ChartCard>

</div>

</>

)}

{/* USERS */}

{activeTab === "users" && (

<div className="bg-white p-8 rounded-3xl shadow">

<h2 className="text-2xl font-bold mb-6">All Users</h2>
<select
value={roleFilter}
onChange={(e)=>setRoleFilter(e.target.value)}
>

<option value="all">All Roles</option>
<option value="user">User</option>
<option value="volunteer">Volunteer</option>
<option value="admin">Admin</option>

</select>

<table className="w-full">

<thead>
<tr className="border-b">
<th className="text-left py-2">Name</th>
<th className="text-left py-2">Email</th>
<th className="text-left py-2">Role</th>
<th className="text-left py-2">Location</th>
<th className="text-left py-2">Joined</th>
<th className="text-left py-2">Actions</th>
</tr>
</thead>

<tbody>

{filteredUsers.map(user=>(
<tr key={user._id} className="border-b">

<td className="py-2">{user.name}</td>

<td className="py-2">{user.email}</td>

<td className="py-2">{user.role}</td>

<td className="py-2">{user.location || "N/A"}</td>

<td className="py-2">
{user.createdAt
? new Date(user.createdAt).toLocaleDateString()
: "N/A"}
</td>

<td className="py-2 space-x-2">

<button className="text-blue-600 text-sm">
View
</button>

<button className="text-red-600 text-sm">
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)}

{/* COMPLAINTS */}

{activeTab === "complaints" && (

<div className="bg-white p-8 rounded-3xl shadow">

<h2 className="text-2xl font-bold mb-6">All Complaints</h2>

<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
>

<option value="all">All Status</option>
<option value="received">Pending</option>
<option value="in_review">In Review</option>
<option value="resolved">Resolved</option>

</select>

<select
value={locationFilter}
onChange={(e)=>setLocationFilter(e.target.value)}
>

<option value="all">All Locations</option>

{locations.map(loc=>(
<option key={loc} value={loc}>
{loc}
</option>
))}

</select>

<table className="w-full">

<thead>

<tr className="border-b">

<th className="text-left py-2">Title</th>

<th className="text-left py-2">Reported By</th>

<th className="text-left py-2">Location</th>

<th className="text-left py-2">Type</th>

<th className="text-left py-2">Status</th>

<th className="text-left py-2">Assigned To</th>

<th className="text-left py-2">Date</th>

<th className="text-left py-2">Actions</th>

</tr>

</thead>

<tbody>

{filteredByLocation.map(c=>(
<tr key={c._id} className="border-b">

<td className="py-2">{c.title}</td>

<td className="py-2">
{c.reportedBy?.name || "Unknown"}
</td>

<td className="py-2">
{c.location || "N/A"}
</td>

<td className="py-2">
{c.type || "Other"}
</td>

<td
className="py-2"
style={{color:getStatusColor(c.status)}}
>
{c.status}
</td>

<td className="py-2">
{c.assignedTo?.name || "Not Assigned"}
</td>

<td className="py-2">
{c.createdAt
? new Date(c.createdAt).toLocaleDateString()
: "N/A"}
</td>

<td className="py-2 space-x-2">

<button className="text-blue-600 text-sm">
View
</button>

<button className="text-green-600 text-sm">
Assign
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)}

{/* ACTIVITY */}

{activeTab === "activity" && (

<div className="bg-white p-8 rounded-3xl shadow">

<h2 className="text-2xl font-bold mb-6">Recent Complaints</h2>

<ul className="space-y-3">

{recentComplaints.map(c=>(
<li key={c._id} className="border-b pb-2">
{c.title} - {c.status}
</li>
))}

</ul>

</div>

)}

</div>

<Footer/>

</div>

)

}

/* STAT CARD */

const StatCard = ({label,val}) => (

<div className="bg-white p-10 rounded-3xl shadow">

<p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
{label}
</p>

<p className="text-5xl font-black">
{val}
</p>

</div>

)

/* CHART CARD */

const ChartCard = ({title,children}) =>(

<div className="bg-white rounded-3xl shadow p-8">

<h2 className="text-xl font-bold mb-6">
{title}
</h2>

{children}

</div>

)

export default AdminDashboard; 