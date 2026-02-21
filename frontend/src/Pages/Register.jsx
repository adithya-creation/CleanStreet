import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, MapPin, ShieldCheck } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Function to detect current location
  const detectLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Could not get location. Please type it manually.");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">Register for CleanStreet</h1>
        </div>
        
        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter your name" />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter your username" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter your email" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input type="tel" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter your phone number" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="Location" 
                />
              </div>
              <button 
                type="button"
                onClick={detectLocation}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
              >
                {loadingLocation ? '...' : 'Detect'}
              </button>
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <select className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white appearance-none">
                <option value="user">User</option>
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input type="password" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            Register <ArrowRight className="h-5 w-5" />
          </button>
        </form>
        
        <p className="text-center mt-6 text-slate-600">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="text-emerald-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;