import React from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
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
        className="relative z-20 bg-white flex sticky justify-between p-3 items-center  md:px-16 w-full"
      >
        <div className="text-2xl font-bold text-teal-600 tracking-wide cursor-pointer">
          CLEAN STREET
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-500">
         
            <a href="#" className="hover:text-teal-600 transition-colors relative group">HOME</a>
            <a href="#" className="hover:text-teal-600 transition-colors relative group">ABOUT</a>
            <a href="#" className="hover:text-teal-600 transition-colors relative group">REPORT ISSUE</a>
            <a href="#" className="hover:text-teal-600 transition-colors relative group">VIEW COMPLAINT</a>

              
        </div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <span className="font-semibold text-teal-700 hidden sm:block uppercase group-hover:text-teal-900">
            USER NAME
          </span>
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 shadow-sm border border-teal-200 group-hover:bg-teal-200 transition">
            <FontAwesomeIcon icon={faUser} />
          </div>
        </motion.div>
      </motion.nav>
    </div>
  )
}

export default Navbar
