import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    {
      href: "https://github.com/sugandv21?tab=repositories",
      label: "GitHub",
      icon: <Github size={24} />,
      color: "text-gray-400 hover:text-white",
    },
    {
      href: "https://www.linkedin.com/in/suganya-s-b30006327/",
      label: "LinkedIn",
      icon: <Linkedin size={24} />,
      color: "text-blue-500 hover:text-blue-400",
    },
    {
      href: "https://x.com/?lang=en-in",
      label: "Twitter",
      icon: <Twitter size={24} />,
      color: "text-sky-400 hover:text-sky-300",
    },
    {
      href: "https://www.instagram.com",
      label: "Instagram",
      icon: <Instagram size={24} />,
      color: "text-pink-500 hover:text-pink-400",
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-white/10 backdrop-blur-md text-gray-300 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col items-center gap-4">
        
        {/* Brand + Copyright */}
        <div className="text-sm text-gray-400 text-center">
          © {year}{" "}
          <span className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            My Portfolio
          </span>
          . All rights reserved.
        </div>

        {/* Social icons row */}
        <div className="flex gap-6">
          {socials.map((s, i) => (
            <Link
              key={i}
              to="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(s.href, "_blank", "noopener,noreferrer");
              }}
              aria-label={s.label}
              className={`transition transform hover:scale-110 ${s.color}`}
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
