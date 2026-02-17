import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const colors = {
    teal600: "#0D9488",
    red400: "#F87171",
    slate100: "#F1F5F9"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  const linkHover = {
    scale: 1.05,
    x: 5,
    color: colors.red400, 
    transition: { type: "spring", stiffness: 300 }
  };

  const socialHover = {
    y: -5,
    backgroundColor: colors.teal600,
    color: "#ffffff",
    transition: { duration: 0.3 }
  };

  return (
    <footer className="bg-teal-900 text-slate-300 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-red-400" />

      <motion.div 
        className="max-w-7xl mx-auto px-6 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-wider uppercase">
              Clean<span className="text-teal-600">Street</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Transforming urban environments with sustainable solutions. 
              We are dedicated to cleaner streets and a greener future.
            </p>
            <div className="flex space-x-4 pt-2">
                <motion.a
                  href="#"
                  whileHover={socialHover}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={socialHover}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={socialHover}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={socialHover}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </motion.a>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b-2 border-red-400 inline-block pb-1">Quick Links</h3>
            <ul className="space-y-2">
              <li><motion.a 
                    href="#" 
                    className="block text-sm cursor-pointer"
                    whileHover={linkHover}
                  >
                    About Us
              </motion.a></li>
              <li><motion.a 
                    href="#" 
                    className="block text-sm cursor-pointer"
                    whileHover={linkHover}
                  >
                   Our Mission
              </motion.a></li>
              <li><motion.a 
                    href="#" 
                    className="block text-sm cursor-pointer"
                    whileHover={linkHover}
                  >
                    Services
              </motion.a></li>
              <li><motion.a 
                    href="#" 
                    className="block text-sm cursor-pointer"
                    whileHover={linkHover}
                  >
                    Community
              </motion.a></li>
              <li><motion.a 
                    href="#" 
                    className="block text-sm cursor-pointer"
                    whileHover={linkHover}
                  >
                    Contact
              </motion.a></li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b-2 border-red-400 inline-block pb-1">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 group cursor-pointer">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 text-teal-600 group-hover:text-red-400 transition-colors" />
                <span className="group-hover:text-white transition-colors">123 Green Avenue,<br />Eco District, India</span>
              </li>
              <li className="flex items-center space-x-3 group cursor-pointer">
                <FontAwesomeIcon icon={faPhone} className="text-teal-600 group-hover:text-red-400 transition-colors" />
                <span className="group-hover:text-white transition-colors">+91 9879866543</span>
              </li>
              <li className="flex items-center space-x-3 group cursor-pointer">
                <FontAwesomeIcon icon={faEnvelope} className="text-teal-600 group-hover:text-red-400 transition-colors" />
                <span className="group-hover:text-white transition-colors">support@cleanstreet.com</span>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b-2 border-red-400 inline-block pb-1">Newsletter</h3>
            <p className="text-sm text-slate-400">
              Join our movement. Get the latest updates directly in your inbox.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="w-full py-3 px-4 bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm text-white placeholder-slate-500 transition-all"
              />
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: colors.red400 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-2 w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center text-white shadow-lg"
              >
                <FontAwesomeIcon icon={faPaperPlane} size="xs" />
              </motion.button>
            </div>
          </motion.div>

        </div>
        <motion.div 
          variants={itemVariants} 
          className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500"
        >
          <p>&copy; 2026 CleanStreet. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <motion.a href="#" className="hover:text-teal-500 transition-colors">Privacy Policy</motion.a>
            <motion.a href="#" className="hover:text-teal-500 transition-colors">Terms of Service</motion.a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;