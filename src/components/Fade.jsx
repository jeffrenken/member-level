import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Fade = ({ children, isVisible, duration = 0.5 }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const FadeToggle = ({ showFirst, firstContent, secondContent, duration = 0.5 }) => {
  return (
    <AnimatePresence mode="wait">
      {showFirst ? (
        <motion.div key="firstContent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration }}>
          {firstContent}
        </motion.div>
      ) : (
        <motion.div key="secondContent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration }}>
          {secondContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FadeToggle;
