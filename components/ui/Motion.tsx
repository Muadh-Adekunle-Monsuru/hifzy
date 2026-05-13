"use client";

import { motion, Variants } from "framer-motion";

export const MotionDiv = motion.div;
export const MotionSection = motion.section;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const staggerContainer: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};
