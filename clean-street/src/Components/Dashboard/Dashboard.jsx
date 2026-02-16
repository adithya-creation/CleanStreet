import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  faMapLocationDot,  faCity,  faChartLine,  faComments, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
  };

  return (
    <div className="hero min-h-screen w-full relative overflow-x-hidden font-sans bg-gradient-to-b from-[#FFF6F0] to-[#E2F5F2]">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 bg-white flex justify-between p-3 items-center  md:px-16 w-full"
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
      <main className="relative z-10 flex flex-col items-center justify-center px-6 mt-10 text-center">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 max-w-4xl leading-tight"
          >
            Your one step can make our street spotless.
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mb-10 leading-relaxed text-sm md:text-base"
          >
            Keeping our street clean is everyone's responsibility. Clean surroundings 
            promote good health and create a pleasant place to live. Small actions 
            like not littering and using dustbins can make a big difference.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-5 mb-16"
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(248, 113, 113, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#F87171] text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-red-200 flex items-center gap-3 transition-colors hover:bg-[#EF4444]"
            >
              <FontAwesomeIcon icon={faPlus} />
               REPORT AN ISSUE
            </motion.button>
           <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(248, 113, 113, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#F87171] text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-red-200 flex items-center gap-3 transition-colors hover:bg-[#EF4444]"
            >
              <FontAwesomeIcon icon={faEye} />
               VIEW REPORTS
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-6xl pb-12"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">How Clean Street Works</h2>
            <p className="text-gray-500 text-sm">Simple steps to make a difference in your community</p>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            >
               <motion.div 
                 variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 60 } }
                }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center group cursor-default"
                >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-teal-500 text-2xl group-hover:text-teal-600 group-hover:scale-110 transition-transform duration-300">
               <FontAwesomeIcon icon= {faMapLocationDot} />
               </div>
               <h3 className="font-bold text-gray-800 text-sm">Easy Reporting</h3>
               <p className="text-[10px] text-gray-500 mt-1 tracking-wider font-bold uppercase">EASY REPORTING</p>
               </motion.div>
               <motion.div 
                 variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 60 } }
                }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center group cursor-default"
                >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-teal-500 text-2xl group-hover:text-teal-600 group-hover:scale-110 transition-transform duration-300">
               <FontAwesomeIcon icon={faCity} />
               </div>
               <h3 className="font-bold text-gray-800 text-sm">Local Assignment</h3>
               <p className="text-[10px] text-gray-500 mt-1 tracking-wider font-bold uppercase">LOCAL ASSIGNMENT</p>
               </motion.div>
               <motion.div 
                 variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 60 } }
                }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center group cursor-default"
                >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-teal-500 text-2xl group-hover:text-teal-600 group-hover:scale-110 transition-transform duration-300">
               <FontAwesomeIcon icon={faChartLine} />
               </div>
               <h3 className="font-bold text-gray-800 text-sm">Real Time Tracking</h3>
               <p className="text-[10px] text-gray-500 mt-1 tracking-wider font-bold uppercase">REAL TIME TRACKING</p>
               </motion.div>
               <motion.div 
                 variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 60 } }
                }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center group cursor-default"
                >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-teal-500 text-2xl group-hover:text-teal-600 group-hover:scale-110 transition-transform duration-300">
               <FontAwesomeIcon icon={faComments} />
               </div>
               <h3 className="font-bold text-gray-800 text-sm">Community Feedback</h3>
               <p className="text-[10px] text-gray-500 mt-1 tracking-wider font-bold uppercase">COMMUNITY FEEDBACK</p>
               </motion.div>
               
             </motion.div>
          </div>
        </motion.div>

      </main>
    </div>
  );
};
export default Dashboard;