import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Login to CleanStreet </p>
        </div>

        {/* Added onSubmit handler here */}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="Enter your email" 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="Enter your password" 
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            Login <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-emerald-600 font-bold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;