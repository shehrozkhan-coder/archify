import React from "react";
import { Box, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const PageNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigate("/")}
        >
          <Box className="text-orange-500" size={24} />
          <span className="font-bold text-xl text-gray-900 tracking-tight">ARCHIFY</span>
        </motion.div>

        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            className="inline-flex"
            whileHover={{ x: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ArrowLeft size={16} />
          </motion.span>
          Home
        </motion.button>
      </div>
    </nav>
  );
};

export default PageNav;