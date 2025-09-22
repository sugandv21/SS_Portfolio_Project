import React from "react";
import { motion } from "framer-motion";
import TypedRole from "./TypedRole";

export default function ProfileCard({
  name,
  intro,
  roles,
  profileImage,
  primary,
  secondary,
  socials = [],
  showText = true, 
}) {
  if (!profileImage) {
    return (
      <div className="text-gray-400 text-sm p-6 border border-gray-700 rounded-lg">
        ProfileCard: Missing data from backend. 
      </div>
    );
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className={`grid ${showText ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-8 items-center`}>
        {/* LEFT: Text (only when showText=true) */}
        {showText && (
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{name}</h1>

            <div className="flex items-center gap-3">
              <TypedRole roles={roles} typingSpeed={70} pause={1200} />
            </div>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed whitespace-pre-line">{intro}</p>

            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" className="text-sm px-3 py-2 rounded-md bg-gray-900 hover:bg-opacity-90 border border-gray-800">
                    {s.label || "Link"}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RIGHT: Profile photo with animated gradient border (always shown) */}
        <div className={`flex justify-center ${showText ? "md:justify-end" : "justify-center"}`}>
          <div
            className="rounded-2xl p-[3px] relative"
            style={{
              background: `conic-gradient(from 180deg at 50% 50%, ${primary}, ${secondary})`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            <div
              className="rounded-xl bg-black p-4"
              style={{
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <motion.img
                src={profileImage}
                alt={`${name || "Profile"} photo`}
                className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-lg shadow-xl"
                initial={{ rotate: 0, scale: 0.98 }}
                animate={{
                  rotate: [0, 2.5, -2.5, 0],
                  scale: [0.98, 1.02, 0.99, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                loading="lazy"
              />

              {/* <motion.div
                className="absolute -right-6 -top-6 w-12 h-12 rounded-full opacity-80"
                initial={{ y: -6, x: 6, scale: 0.9 }}
                animate={{
                  y: [-6, 6, -6],
                  x: [6, -6, 6],
                  scale: [0.9, 1.06, 0.9],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${primary}, transparent 40%), radial-gradient(circle at 70% 70%, ${secondary}, transparent 35%)`,
                  boxShadow: `${secondary}33 0 6px 20px`,
                }}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
