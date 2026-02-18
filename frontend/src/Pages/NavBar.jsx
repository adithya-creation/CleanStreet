/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import cleanStreetBg from '../assets/Media.jpg';

const Navbar = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${cleanStreetBg})` }}
      />
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 bg-white flex sticky justify-between p-3 items-center md:px-16 w-full"
      >
        <Link
          to="/"
          className="text-2xl font-bold text-teal-600 tracking-wide cursor-pointer"
        >
          CLEAN STREET
        </Link>

        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-500">
          <Link to="/" className="hover:text-teal-600 transition-colors relative group">
            HOME
          </Link>
          <a href="#about" className="hover:text-teal-600 transition-colors relative group">
            ABOUT
          </a>
          <Link
            to="/login"
            className="hover:text-teal-600 transition-colors relative group"
          >
            REPORT ISSUE
          </Link>
          <Link
            to="/login"
            className="hover:text-teal-600 transition-colors relative group"
          >
            VIEW COMPLAINT
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-teal-500 text-teal-600 font-semibold text-sm hover:bg-teal-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-red-400 hover:bg-red-500 text-white font-semibold text-sm transition-colors"
          >
            Register
          </Link>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
