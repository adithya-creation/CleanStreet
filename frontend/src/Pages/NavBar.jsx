import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="relative z-50">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        
        className="bg-white/95 backdrop-blur-sm flex sticky top-0 justify-between p-3 items-center md:px-16 w-full shadow-md"
      >
        
        <Link
          to="/"
          className="text-2xl font-bold text-teal-600 tracking-wide cursor-pointer flex items-center"
        >
          CLEAN <span className="text-gray-800 ml-1">STREET</span>
        </Link>

        <div className="hidden md:flex space-x-8 text-sm font-bold text-gray-600">
          <Link to="/" className="hover:text-teal-600 transition-colors">
            HOME
          </Link>
          <a href="#about" className="hover:text-teal-600 transition-colors">
            ABOUT
          </a>
          <Link
            to="/login"
            className="hover:text-teal-600 transition-colors"
          >
            REPORT ISSUE
          </Link>
          <Link
            to="/login"
            className="hover:text-teal-600 transition-colors"
          >
            VIEW COMPLAINT
          </Link>
        </div>

      
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            to="/login"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-teal-600 text-teal-600 font-semibold text-xs sm:text-sm hover:bg-teal-50 transition-colors"
          >
            Login
          </Link>

          <Link
            to="/login"
            className="hidden sm:block px-4 py-2 rounded-lg border border-red-200 text-gray-500 font-semibold text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Logout
          </Link>

          <Link
            to="/register"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-red-400 hover:bg-red-400 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
          >
            Register
          </Link>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;