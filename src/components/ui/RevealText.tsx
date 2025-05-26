import React from 'react';
import { motion } from 'framer-motion';

interface RevealTextProps {
  children: React.ReactNode;
  delay?: number;
}

const RevealText: React.FC<RevealTextProps> = ({ children, delay = 0 }) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.2, 0.8, 0.2, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default RevealText; 