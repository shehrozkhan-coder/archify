import React, { useState } from "react";
import { Box, Menu, X } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (error) {
        console.log(`Puter sign out failed: ${error}`);
      }
      return;
    }
    try {
      await signIn();
    } catch (error) {
      console.log(`Puter signin failed: ${error}`);
    }
  };

  const navLinks = [
    { label: "Product", path: null },
    { label: "Pricing", path: "/pricing" },
    { label: "Blog", path: "/blog" },
  ];

  const handleNavClick = (path: string | null) => {
    if (path) navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger — navbar ke bahar, logo ke left */}
      <motion.button
        className="fixed top-[18px] left-4 z-[60] flex md:hidden items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-200 shadow-sm"
        onClick={() => setMenuOpen(!menuOpen)}
        whileTap={{ scale: 0.93 }}
      >
        <AnimatePresence mode="wait">
          {menuOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={18} className="text-gray-700" />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={18} className="text-gray-700" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-[64px] left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-lg md:hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <button
                    onClick={() => handleNavClick(link.path)}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-3">
                {isSignedIn ? (
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm text-gray-600">Hi, <span className="font-semibold text-gray-900">{userName}</span></span>
                    <button onClick={handleAuthClick} className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">Log Out</button>
                  </div>
                ) : (
                  <div className="flex gap-2 px-4">
                    <button onClick={handleAuthClick} className="flex-1 text-sm font-semibold py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Log In</button>
                    <a href="#upload" onClick={() => setMenuOpen(false)} className="flex-1 text-center bg-orange-500 text-white text-sm font-semibold py-2 rounded-lg">Get Started</a>
                  </div>
                )}
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <motion.header
        className="navbar fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="inner flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          {/* Left section */}
          <div className="left flex items-center gap-10">
            <motion.div
              className="brand flex items-center gap-2 cursor-pointer pl-8 md:pl-0"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Box className="text-orange-500" size={26} />
              <span className="font-bold text-xl text-gray-900 tracking-tight">ARCHIFY</span>
            </motion.div>

            {/* Desktop nav links only */}
            <ul className="links hidden md:flex gap-1 text-sm text-gray-600 font-medium">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                >
                  <button
                    onClick={() => handleNavClick(link.path)}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 block cursor-pointer"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right section */}
          <motion.div
            className="action flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isSignedIn ? (
              <>
                <span className="hidden sm:block text-sm text-gray-600 font-medium px-3">
                  Hi, <span className="text-gray-900 font-semibold">{userName}</span>
                </span>
                <motion.button
                  onClick={handleAuthClick}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-orange-500 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-orange-600 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                >
                  Log Out
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={handleAuthClick}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden sm:block text-sm text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  Log In
                </motion.button>
                <motion.a
                  href="#upload"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-orange-500 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-orange-600 hover:shadow-orange-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  Get Started →
                </motion.a>
              </>
            )}
          </motion.div>
        </nav>
      </motion.header>
    </>
  );
};

export default Navbar;