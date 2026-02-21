import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, MapPin, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import NavBar from '../Components/common/NavBar';
import Footer from '../Components/common/Footer';
import { register } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', location: '', role: 'user'
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const detectLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        role: formData.role,
      });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors) {
        setError(Object.values(fieldErrors).join(' · '));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2] flex flex-col font-sans">
      <NavBar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl p-8 my-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Register for CleanStreet</h1>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="Enter your name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="Enter your email" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="Min. 6 characters" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                  <input name="location" type="text" value={formData.location} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none" placeholder="Your location" />
                </div>
                <button type="button" onClick={detectLocation} className="px-3 py-2 bg-white/60 hover:bg-white/80 text-teal-600 border border-white/60 rounded-lg text-xs font-semibold transition-colors">
                  {loadingLocation ? '...' : 'Detect'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-white/60 bg-white/60 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none appearance-none">
                  <option value="user">User</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F87171] hover:bg-[#EF4444] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-red-200"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span>Register</span><ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-teal-600 font-semibold hover:underline">Login</button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;