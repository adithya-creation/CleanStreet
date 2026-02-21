import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, MapPin, Camera, Send, X, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ReportIssue = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    priority: '',
    address: '',
    landmark: '',
    description: ''
  });

  const [position, setPosition] = useState([20.5937, 78.9629]); // India
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const getAddress = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setFormData(prev => ({ ...prev, address: data.display_name || `${lat}, ${lng}` }));
    } catch (error) {
      setFormData(prev => ({ ...prev, address: `${lat}, ${lng}` }));
    }
    setLoadingAddress(false);
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        getAddress(lat, lng);
      },
    });
    return position ? <Marker position={position} /> : null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-[1000]">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-600" />
        </button>
        <h2 className="text-xl font-black text-emerald-600 uppercase tracking-tighter">Report Problem</h2>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <Info className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold uppercase tracking-tight">Issue Details</h3>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Issue Title *</label>
                <input name="title" type="text" value={formData.title} onChange={handleInputChange} placeholder="e.g., Overflowing bin on Park Ave" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Issue Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value="">-- Select --</option>
                    <option value="waste">Waste / Garbage</option>
                    <option value="pothole">Pothole</option>
                    <option value="water">Water Leakage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Priority *</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value="">-- Select --</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Address (Auto-filled by Map) */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest flex justify-between">
                  Location Address * {loadingAddress && <span className="text-emerald-500 animate-pulse italic">Fetching...</span>}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500" />
                  <input name="address" type="text" value={formData.address} onChange={handleInputChange} placeholder="Click on the map to pin location" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 font-medium text-sm" />
                </div>
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Nearby Landmark</label>
                <input name="landmark" type="text" value={formData.landmark} onChange={handleInputChange} placeholder="e.g., Near City Mall" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Detailed Description</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Describe the issue in detail..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
              </div>

              {/* Photo Upload */}
              <div 
                onClick={() => fileInputRef.current.click()}
                className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer group bg-slate-50/50"
              >
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                {selectedImage ? (
                  <div className="relative inline-block">
                    <img src={selectedImage} alt="Preview" className="h-32 rounded-lg shadow-md" />
                    <button onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="h-8 w-8 text-slate-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attach Issue Photo</span>
                  </div>
                )}
              </div>

              <button 
                onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> SUBMIT REPORT
              </button>
            </div>
          </div>

          {/* Right Side: Interactive Map */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 h-[650px] flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold uppercase tracking-tight">Pinpoint Location</h3>
              </div>
              
              <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 z-0">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
              
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl flex items-start gap-3 border border-emerald-100">
                <AlertCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Click anywhere on the map above to set the exact location of the issue. The address will be updated automatically in the form.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportIssue;