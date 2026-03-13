import React, { useState, useEffect } from "react";
import NavBar from "../Components/common/NavBar";
import Footer from "../Components/common/Footer";
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "../services/authService";
import { Bell, Check, CheckCircle2, Trash2 } from "lucide-react";

const Notifications = () => {

const [notifications, setNotifications] = useState([]);

useEffect(()=>{
  loadNotifications();
},[]);

const loadNotifications = async () => {
  try{
    const data = await getNotifications();
    setNotifications(data);
  }catch(err){
    console.error('Failed to load notifications', err);
  }
};

const handleMarkRead = async (id) => {
    try {
        await markNotificationRead(id);
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
        console.error('Failed to mark read', err);
    }
};

const handleMarkAllRead = async () => {
    try {
        await markAllNotificationsRead();
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
        console.error('Failed to mark all read', err);
    }
};

const handleDelete = async (id) => {
    try {
        await deleteNotification(id);
        setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
        console.error('Failed to delete notification', err);
    }
};

return(
<div className="min-h-screen flex flex-col bg-gray-50 font-sans">
{/* Navbar */}
<NavBar />

{/* Page Content */}
<div className="flex-grow max-w-4xl mx-auto w-full p-6">

<div className="flex items-center justify-between mb-8">
  <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
    <div className="p-2 bg-teal-100/50 rounded-xl text-teal-600">
        <Bell size={28} />
    </div>
    Notifications
  </h2>
  {notifications.filter(n => !n.isRead).length > 0 && (
    <button 
      onClick={handleMarkAllRead}
      className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg transition-colors"
    >
      <CheckCircle2 size={16} /> Mark all as read
    </button>
  )}
</div>

<div className="space-y-4">
{Math.max(0, notifications.length) > 0 ? notifications.map(n=>(
  <div
    key={n._id}
    className={`group relative p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all duration-200 flex items-start gap-4 ${!n.isRead ? 'border-l-4 border-l-teal-500 bg-teal-50/10' : ''}`}
  >
    {/* Icon Indicator */}
    <div className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full ${!n.isRead ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]' : 'bg-gray-300'}`}></div>

    <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Message Content */}
        <div>
            <p className={`text-[15px] leading-relaxed ${!n.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                {n.message}
            </p>
            <p className="text-xs font-medium text-gray-400 mt-1.5 flex items-center gap-1.5">
                {new Date(n.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
            </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {!n.isRead && (
                <button 
                  onClick={() => handleMarkRead(n._id)}
                  className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
                  title="Mark as read"
                >
                    <Check size={20} />
                </button>
            )}
            <button 
                onClick={() => handleDelete(n._id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Delete notification"
            >
                <Trash2 size={20} />
            </button>
        </div>
    </div>
  </div>
)) : (
  <div className="p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
        <Bell size={32} />
    </div>
    <h3 className="text-lg font-bold text-gray-700 mb-1">All Caught Up</h3>
    <p className="text-sm text-gray-500">You don't have any notifications right now.</p>
  </div>
)}

</div>
</div>

{/* Footer */}
<Footer />
</div>
);
};

export default Notifications;