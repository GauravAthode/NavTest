import React from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-slate-950/60">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-emerald-400 shadow-glow" />
          <div>
            <div className="text-lg font-semibold leading-tight">VoltPath</div>
            <div className="text-xs text-slate-400">EV Route & Charging Planner</div>
          </div>
        </motion.div>

        <div className="text-xs text-slate-400">
          Part 1 • Core Route & Charging Optimization
        </div>
      </div>
    </div>
  );
}