import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BackdropProps {
  onClick: () => void;
  children: ReactNode;
}

export function Backdrop({ children, onClick }: BackdropProps) {
  return (
    <motion.div
      onClick={onClick}
      className="fixed top-0 left-0 min-h-[100%] w-full bg-gradient-to-r from-[#031540]/80 
      to-[#281036]/80 flex items-center justify-center z-50 md:overflow-auto flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}