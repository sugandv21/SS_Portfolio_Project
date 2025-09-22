import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

export default function AnimatedCTA({
  to = "/contact",
  text = "Contact me",
  primary = "#00FFFF",
  secondary = "#8A2BE2",
}) {
  const controls = useAnimation();

  // Idle dancing loop (include scale: 1 so it resets after hover)
  const idle = {
    y: [0, -6, 0, 6, 0],
    rotate: [0, 1.5, 0, -1.5, 0],
    scale: 1,
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
  };

  // Hover (stop + zoom)
  const hoverState = {
    y: 0,
    rotate: 0,
    scale: 1.1,
    transition: { duration: 0.25, ease: "easeOut" },
  };

  // Tap / click effect
  const tapState = {
    scale: 0.95,
    transition: { duration: 0.15 },
  };

  // Start idle loop on mount
  useEffect(() => {
    controls.start(idle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      animate={controls}
      whileTap={tapState}
      onHoverStart={() => controls.start(hoverState)}
      onHoverEnd={() => controls.start(idle)}
      className="inline-block"
    >
      <Link
        to={to}
        className="relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-black"
        style={{
          backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary})`,
          boxShadow: `0 10px 25px ${secondary}44, inset 0 -2px 6px ${primary}33`,
        }}
      >
        {text}
      </Link>
    </motion.div>
  );
}
