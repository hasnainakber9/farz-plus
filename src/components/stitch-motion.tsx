"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function FloatIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SignalPulse({ className }: { className?: string }) {
  return (
    <motion.span
      className={className}
      animate={{ scale: [1, 1.25, 1], opacity: [0.75, 1, 0.75] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function CountingBar({ width = "72%", delay = 0 }: { width?: string; delay?: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#80C3DC] to-[#4CD364] shadow-[0_0_18px_rgba(76,211,100,0.45)]"
        initial={{ width: "0%" }}
        whileInView={{ width }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
