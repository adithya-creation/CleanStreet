import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, MapPin, ShieldCheck } from 'lucide-react';
import NavBar from '../Components/common/NavBar';
import Footer from '../Components/common/Footer';

const Register = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const detectLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLoadingLocation(false);
        },
        () => {
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
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2] flex flex-col font-sans">
      <NavBar variant="public" />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl p-8 my-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Register for CleanStreet</h1>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" required className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="Enter your name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" required className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="Enter your username" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="email" required className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="Enter your email" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="tel" required className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="Enter your phone number" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
                    placeholder="Location"
                  />
                </div>
                <button
                  type="button"
                  onClick={detectLocation}
                  className="px-3 py-2 bg-white/60 hover:bg-white/80 text-teal-600 border border-white/60 rounded-lg text-xs font-semibold transition-colors"
                >
                  {loadingLocation ? '...' : 'Detect'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                <select className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none appearance-none">
                  <option value="user">User</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="password" required className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="••••••••" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F87171] hover:bg-[#EF4444] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-red-200"
            >
              Register <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-teal-600 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;