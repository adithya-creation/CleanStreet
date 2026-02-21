import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import NavBar from '../Components/common/NavBar';
import Footer from '../Components/common/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState({ fullName: "New User" });
  const [reports] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2] font-sans text-gray-800 flex flex-col">
      <NavBar variant="app" userName={user.fullName} onLogout={handleLogout} />

      <div className="flex-1 max-w-6xl w-full mx-auto p-8 pt-12">
        <header className="mb-12 text-left">
          <h1 className="text-4xl font-black tracking-tight text-gray-800">Welcome, {user.fullName.split(' ')[0]}</h1>
          <p className="text-gray-500 font-medium mt-1">Ready to make your neighborhood better?</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard label="Total Reports" val={reports.length} />
          <StatCard label="In Progress" val={0} />
          <StatCard label="Fixed Issues" val={0} />
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-16 shadow-sm border border-white/60 text-center">
          <div className="bg-white/50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3 transition-transform hover:rotate-0">
            <ClipboardList className="text-teal-300" size={48} />
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">No activity reported yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
            Your neighborhood is looking clean! If you spot an issue, click below to let us know.
          </p>
          <button
            onClick={() => navigate('/report')}
            className="bg-[#F87171] hover:bg-[#EF4444] text-white px-12 py-5 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-200 text-sm tracking-widest uppercase"
          >
            Create New Report +
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const StatCard = ({ label, val }) => (
  <div className="bg-white/40 backdrop-blur-md p-10 rounded-[40px] shadow-sm border border-white/60 transition-all hover:border-teal-200 group">
    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 group-hover:text-teal-500 transition-colors">{label}</p>
    <p className="text-7xl font-black text-gray-800 leading-none">{val}</p>
  </div>
);

export default Dashboard;