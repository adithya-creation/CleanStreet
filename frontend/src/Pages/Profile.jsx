import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Camera, ChevronLeft, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Adeline",
    email: "adeline@gmail.com",
    location: "Chennai",

    role: "Admin",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const goBackToDashboard = () => navigate('/dashboard');

  const handleSave = (e) => {
    e.preventDefault();
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      goBackToDashboard();
    }, 1500);
  };

  const firstLetter = formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-full duration-300">
          <CheckCircle className="h-6 w-6" />
          <span className="font-bold text-lg">Changes saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={goBackToDashboard} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </button>
          <h2 className="text-xl font-black text-emerald-600">CleanStreet</h2>
        </div>
        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">{firstLetter}</div>
      </div>

      <div className="max-w-6xl mx-auto p-6 mt-8 pb-20">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-800">Account Settings</h1>
          <p className="text-slate-500">Manage your profile details and security.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 border-4 border-emerald-50 rounded-full flex items-center justify-center bg-slate-100 text-emerald-600 text-5xl font-black shadow-inner">{firstLetter}</div>
                <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-emerald-600 hover:scale-110"><Camera className="h-5 w-5" /></button>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 break-all">{formData.fullName}</h2>
              <p className="text-slate-500 text-sm mb-4 break-all">{formData.email}</p>
              <span className="bg-emerald-50 text-emerald-600 px-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{formData.role}</span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100">
                <button onClick={() => setActiveTab('personal')} className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activeTab === 'personal' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/20' : 'text-slate-400'}`}>
                  <User className="h-4 w-4" /> Personal Details
                </button>
                <button onClick={() => setActiveTab('security')} className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activeTab === 'security' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/20' : 'text-slate-400'}`}>
                  <Shield className="h-4 w-4" /> Security
                </button>
              </div>

              <div className="p-8">
                {activeTab === 'personal' ? (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                        <input name="fullName" type="text" value={formData.fullName} onChange={handlePersonalChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <input name="email" type="email" value={formData.email} onChange={handlePersonalChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Location</label>
                        <input name="location" type="text" value={formData.location} onChange={handlePersonalChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400">Role (Locked)</label>
                        <input disabled value={formData.role} className="w-full px-4 py-3 border border-slate-100 bg-slate-50 rounded-xl text-slate-400 cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Bio</label>
                      <textarea name="bio" rows="4" value={formData.bio} onChange={handlePersonalChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Tell us about yourself..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                      <button type="button" onClick={goBackToDashboard} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                      <button type="submit" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Save Changes</button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSave} className="space-y-6">
                    {/* Security Fields */}
                    {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                        <div className="relative">
                          <input 
                            name={field}
                            type={showPass[field] ? "text" : "password"} 
                            value={securityData[field]} 
                            onChange={handleSecurityChange}
                            placeholder="••••••••"
                            className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPass(p => ({...p, [field]: !p[field]}))}
                            className="absolute right-3 top-3 text-slate-400"
                          >
                            {showPass[field] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                      <button type="button" onClick={goBackToDashboard} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                      <button type="submit" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Update Password</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;