import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* LEFT: text skeletons with shimmer */}
          <div className="space-y-5">
            {[
              "w-40 h-5",
              "w-64 h-10",
              "w-56 h-8",
              "w-full h-24",
              "w-28 h-10",
              "w-28 h-10",
            ].map((cls, i) => (
              <div
                key={i}
                className={`relative overflow-hidden bg-gray-800 rounded ${cls} ${
                  i >= 4 ? "inline-block mr-3" : "block"
                }`}
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            ))}
          </div>

          {/* RIGHT: profile image skeleton */}
          <div className="flex justify-center md:justify-end relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* glowing border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 blur-xl opacity-40 animate-pulse" />
              {/* circle skeleton */}
              <div className="rounded-full bg-gray-800 h-56 w-56 md:h-72 md:w-72 relative z-10" />
            </motion.div>
          </div>
        </div>

        {/* Loading text with animated dots */}
        <motion.div
          className="mt-12 text-center text-gray-400 text-sm tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading content<span className="animate-pulse">...</span>
        </motion.div>
      </div>

      {/* shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}

