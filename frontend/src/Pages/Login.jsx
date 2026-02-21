import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import NavBar from '../Components/common/NavBar';
import Footer from '../Components/common/Footer';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2] flex flex-col font-sans">
      <NavBar variant="public" />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Login to CleanStreet</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-white/60 bg-white/60 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-white/60 bg-white/60 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F87171] hover:bg-[#EF4444] text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
            >
              Login <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-teal-600 font-bold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;