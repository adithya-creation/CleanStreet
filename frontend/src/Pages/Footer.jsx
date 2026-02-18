import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col items-center text-center gap-2 md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wider uppercase">
              Clean<span className="text-teal-400">Street</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              A simple way to keep your streets clean and safe.
            </p>
          </div>
          <div className="text-xs text-slate-400 mt-3 md:mt-0 md:text-right">
            
            <p className="mt-1">&copy; 2026 CleanStreet. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;