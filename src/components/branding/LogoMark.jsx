import React from "react";
import { motion } from "framer-motion";

export default function LogoMark() {
  return (
    <motion.span
      className="logo-mark"
      initial={{ opacity: 0, scale: 0.92, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" role="presentation" focusable="false">
        <defs>
          <linearGradient id="skGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.98" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.62" />
          </linearGradient>
        </defs>
        <rect x="5" y="5" width="54" height="54" rx="18" className="logo-mark-frame" />
        <path
          d="M20 23c3-5 8-7 14-7 6 0 10 2 13 5"
          className="logo-mark-stroke"
        />
        <path
          d="M20 31c0-4 3-7 8-7h9c4 0 7 2 7 6 0 4-3 6-7 6h-9c-5 0-8 3-8 8"
          className="logo-mark-stroke"
        />
        <path
          d="M44 18 28 34l17 12"
          className="logo-mark-stroke accent"
        />
      </svg>
    </motion.span>
  );
}
