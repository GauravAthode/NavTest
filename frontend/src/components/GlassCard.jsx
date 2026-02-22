import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={
        "rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-5 shadow-xl " + className
      }
    >
      {children}
    </motion.div>
  );
}