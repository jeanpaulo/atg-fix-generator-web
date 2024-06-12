import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ isVisible, children }) => {
  return (
    <div className="fixed flex bottom-6">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="alert alert-warning"
          >
            <WarningSvgIcon />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WarningSvgIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);
