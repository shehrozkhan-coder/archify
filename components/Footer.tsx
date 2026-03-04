import React from "react";
import { Box } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-white border-t border-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Box className="text-orange-500" size={22} />
          <span className="text-gray-900 font-bold text-lg tracking-tight">ARCHIFY</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-gray-500">
          {["Products", "Pricing", "Community", "Privacy", "Terms"].map((link) => (
            <motion.a
              key={link}
              href="#"
              whileHover={{ color: "#f97316" }}
              className="hover:text-orange-500 transition-colors duration-200"
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Archify. All rights reserved.
        </p>

      </div>
    </motion.footer>
  );
};

export default Footer;