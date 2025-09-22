import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // npm install lucide-react
import API from "../api/axios";

export default function Navbar() {
  const [brand, setBrand] = useState({ brand_name: "My portfolio" });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    API.get("pages/site-settings/")
      .then((res) => {
        if (res.data && res.data.length) setBrand(res.data[0]);
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { to: "/about", label: "About" },
    { to: "/resume", label: "Resume" },
    { to: "/work", label: "Work" },
    { to: "/contact", label: "Contact" },
  ];

  const linkClasses = ({ isActive }) =>
    `relative block py-2 px-3 rounded-md font-bold text-lg transition-colors duration-300
     ${isActive ? "text-cyan-400" : "text-white hover:text-cyan-300"}`;

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main row */}
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-wide"
          >
            {brand.brand_name || "My portfolio"}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses}>
                {({ isActive }) => (
                  <span className="relative">
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="underline"
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded"
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-cyan-400 hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <motion.div
        initial={false}
        animate={menuOpen ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden md:hidden bg-black/90 backdrop-blur-md border-t border-white/10"
      >
        <div className="flex flex-col px-4 sm:px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="block py-2 px-3 rounded-md text-gray-200 hover:text-cyan-400 hover:bg-white/5 transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
