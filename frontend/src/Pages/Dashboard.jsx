import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  LayoutGrid, 
  Shield, 
  Eye, 
  ChevronDown,
  User,
  LogOut 
} from 'lucide-react'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [user] = useState({ fullName: "New User" });
  const [reports] = useState([]); 

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <header className="bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto grid grid-cols-3 items-center">
          
          <div className="flex justify-start">
            <h2 
              className="text-2xl font-black text-emerald-600 tracking-tighter cursor-pointer" 
              onClick={() => navigate('/dashboard')}
            >
              CleanStreet
            </h2>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-10">
            <NavItem label="DASHBOARD" active onClick={() => navigate('/dashboard')} />
            <NavItem label="ADMIN PANEL" onClick={() => navigate('/admin')} />
            <NavItem label="REPORT ISSUE" onClick={() => navigate('/report')} />
            <NavItem label="VIEW COMPLAINTS" onClick={() => navigate('/complaints')} />
          </nav>

          <div className="flex justify-end">
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                  {user.fullName.charAt(0)}
                </div>
                <span className="text-sm font-bold text-slate-700">{user.fullName}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in duration-100">
                  <DropdownItem icon={<User size={16}/>} label="Edit Profile" onClick={() => navigate('/profile')} />
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <DropdownItem icon={<LogOut size={16}/>} label="Logout" danger onClick={handleLogout} />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 pt-12">
        <header className="mb-12 text-left">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Welcome, {user.fullName.split(' ')[0]}</h1>
          <p className="text-slate-500 font-medium mt-1">Ready to make your neighborhood better?</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard label="Total Reports" val={reports.length} />
          <StatCard label="In Progress" val={0} />
          <StatCard label="Fixed Issues" val={0} />
        </div>

        <div className="bg-white rounded-[40px] p-16 shadow-sm border border-slate-200 text-center">
          <div className="bg-slate-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3 transition-transform hover:rotate-0">
            <ClipboardList className="text-slate-200" size={48} />
          </div>
          <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">No activity reported yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
            Your neighborhood is looking clean! If you spot an issue, click below to let us know.
          </p>
          <button 
            onClick={() => navigate('/report')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-100 text-sm tracking-widest uppercase"
          >
            Create New Report +
          </button>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`text-[11px] font-black tracking-[0.15em] transition-all pb-1 border-b-2 ${
      active ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-700'
    }`}
  >
    {label}
  </button>
);

const DropdownItem = ({ icon, label, onClick, danger }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${
      danger ? 'text-red-500 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ label, val }) => (
  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 transition-all hover:border-emerald-200 group">
    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 group-hover:text-emerald-500 transition-colors">{label}</p>
    <p className="text-7xl font-black text-slate-900 leading-none">{val}</p>
  </div>
);

export default Dashboard;