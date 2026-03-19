import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, fetchMe, logout, getNotifications, deleteNotification } from '../../services/authService';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Bell, Trash2 } from 'lucide-react';

// SVG Logo mark
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#0D9488" />
        <path d="M16 6C16 6 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 6 16 6Z" fill="white" fillOpacity="0.9" />
        <path d="M16 26V16" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 20C16 20 13 17 11 16" stroke="#0D9488" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M16 17C16 17 18.5 14.5 20 14" stroke="#0D9488" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const loggedIn = isAuthenticated();

    const [user, setUser] = useState(getCurrentUser());
    const role = user?.role; // 'user' | 'volunteer' | 'admin'

    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);

    const userName = user?.name || 'User';
    const userPhoto = user?.profilePhoto || null;

    useEffect(() => {
        const refresh = () => setUser(getCurrentUser());
        window.addEventListener('userUpdated', refresh);
        window.addEventListener('storage', refresh);
        return () => {
            window.removeEventListener('userUpdated', refresh);
            window.removeEventListener('storage', refresh);
        };
    }, []);

    useEffect(() => {
        if (!isAuthenticated()) return;
        fetchMe().then(freshUser => {
            if (freshUser?.profilePhoto) {
                const stored = getCurrentUser() || {};
                const updated = { ...stored, profilePhoto: freshUser.profilePhoto };
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
            }
        }).catch(() => { });
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        if (!isAuthenticated()) return;
        fetchNotifications();
    }, [role]);

    const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },

  ...(role === 'admin'
    ? [{ label: 'Admin Panel', path: '/admin' }]
    : []),

  ...(role !== 'volunteer'
    ? [{ label: 'Report Issue', path: '/report' }]
    : []),

  { label: 'View Complaints', path: '/complaints' },

  ...(role === 'volunteer'
    ? [{ label: 'My Ratings', path: '/volunteer/ratings' }]
    : []),

  ...(role !== 'admin' 
    ? [{ label: 'Feedback', path: '/feedback' }] 
    : [])
];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        setDropdownOpen(false);
        setMenuOpen(false);
        logout();
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/60 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2.5 cursor-pointer group"
                >
                    <Logo />
                    <span className="text-xl font-black text-gray-800 tracking-tight group-hover:text-teal-700 transition-colors">
                        Clean<span className="text-teal-600">Street</span>
                    </span>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => navigate(link.path)}
                            className={`text-sm font-semibold tracking-wide transition-colors pb-0.5 border-b-2 ${isActive(link.path)
                                    ? 'text-teal-600 border-teal-500'
                                    : 'text-gray-500 border-transparent hover:text-teal-600 hover:border-teal-300'
                                } `}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
                {/* Desktop Right Side */}
               <div className="hidden md:flex items-center gap-3">
                 {loggedIn ? (
                 <>
                    {/* Notification Bell */}
                    <div className="relative">



  {/* Bell Button */}
  <button
    onClick={() => {
        setNotifOpen(!notifOpen);
        if (!notifOpen) fetchNotifications(); // Refresh on open
    }}
    className={`relative p-2.5 rounded-xl transition duration-200 ${notifOpen ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-100 text-gray-600'}`}
  >
    <Bell size={22} className={notifOpen ? 'text-teal-600' : 'text-gray-600'} />

    {notifications.filter(n => !n.isRead).length > 0 && (
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center rounded-full shadow-md">
  {notifications.filter(n => !n.isRead).length}
</span>
    )}
  </button>

  {/* Notification Dropdown */}
  {notifOpen && (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-800 tracking-tight">Notifications</h3>
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
            {notifications.filter(n => !n.isRead).length} new
          </span>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto custom-scrollbar">

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <Bell size={24} className="text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <div
              key={n._id}
              onClick={async () => {
                  if (!n.isRead) {
                      try {
                          await import('../../services/authService').then(m => m.markNotificationRead(n._id));
                          fetchNotifications(); 
                      } catch(e) {}
                  }
                  setNotifOpen(false);
                  navigate('/notifications');
              }}
              className={`group flex items-start gap-3 px-5 py-4 cursor-pointer border-b border-gray-50 transition-colors ${!n.isRead ? 'bg-teal-50/30 hover:bg-teal-50/60' : 'hover:bg-gray-50'}`}
            >
              <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!n.isRead ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'bg-transparent'}`}></div>

              {/* Text */}
              <div className="flex-grow">
                  <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                    {n.message}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 mt-1.5">
                    {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
              </div>

              {/* Delete Button */}
              <button 
                  onClick={(e) => {
                      e.stopPropagation(); 
                      deleteNotification(n._id)
                          .then(() => fetchNotifications())
                          .catch(console.error);
                  }}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                  title="Delete"
              >
                  <Trash2 size={16} />
              </button>
            </div>
          ))
        )}

      </div>

      {/* View More */}
      <button
        onClick={() => {
          setNotifOpen(false);
          navigate("/notifications");
        }}
        className="w-full py-3 text-sm font-semibold text-teal-600 hover:bg-teal-50 transition"
      >
        View All Notifications →
      </button>

    </div>
  )}
</div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white/70 hover:bg-white transition-all border border-white/60 shadow-sm"
                            >
                                <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                                    {userPhoto
                                        ? <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
                                        : userName.charAt(0)
                                    }
                                </div>
                                <span className="text-sm font-bold text-gray-700">{userName}</span>
                                <ChevronDown size={14} className={`text - gray - 400 transition - transform duration - 200 ${dropdownOpen ? 'rotate-180' : ''} `} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-52 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 py-2 z-[60]">
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                    >
                                        <LayoutDashboard size={16} /> Dashboard
                                    </button>
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                    >
                                        <User size={16} /> Edit Profile
                                    </button>
                                    <div className="h-px bg-gray-100 my-1 mx-3" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-bold text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-[#F87171] hover:bg-[#EF4444] text-white text-sm font-bold px-5 py-2 rounded-lg shadow-md shadow-red-200 transition-all hover:scale-[1.03]"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-gray-600 hover:text-teal-600 transition-colors p-1"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white/80 backdrop-blur-md border-t border-white/60 px-6 pb-6 pt-4 flex flex-col gap-3">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => { navigate(link.path); setMenuOpen(false); }}
                            className={`text-sm font-semibold text-left py-1 transition-colors ${isActive(link.path) ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                    {loggedIn ? (
                        /* Logged in: user avatar + dropdown */
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white/70 hover:bg-white transition-all border border-white/60 shadow-sm"
                            >
                                <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                                    {userPhoto
                                        ? <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
                                        : userName.charAt(0)
                                    }
                                </div>
                                <span className="text-sm font-bold text-gray-700">{userName}</span>
                                <ChevronDown size={14} className={`text - gray - 400 transition - transform duration - 200 ${dropdownOpen ? 'rotate-180' : ''} `} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-52 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 py-2 z-[60]">
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                    >
                                        <LayoutDashboard size={16} /> Dashboard
                                    </button>
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                    >
                                        <User size={16} /> Edit Profile
                                    </button>

                                    <div className="h-px bg-gray-100 my-1" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-bold text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-[#F87171] hover:bg-[#EF4444] text-white text-sm font-bold px-5 py-2 rounded-lg shadow-md shadow-red-200 transition-all hover:scale-[1.03]"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavBar;
