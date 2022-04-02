import { Backdrop } from "../Backdrop";
import { motion } from "framer-motion";
import Atropos from "atropos/react";

interface ModalProps {
  handleClose: () => void;
  name: string;
  image: string;
}

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

export function Modal({ handleClose, name, image }: ModalProps) {
  return (
    <Backdrop onClick={handleClose}>
      <h2 className="text-[#4EE39D] text-2xl mb-2">You have minted {name}</h2>

      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="rounded-xl flex flex-col justify-center bg-white dark:bg-[#1D2226] p-2 
        items-center bg-gradient-to-br from-[#D834FF]/75 to-[#0A84FF]/75"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Atropos
          activeOffset={40}
          shadowScale={1.05}
          className='rounded-xl'
          highlight={false}
        >
          <img 
            src={image} 
            alt="" 
            className="w-64 h-72 lg:w-80 lg:h-96 object-cover rounded-xl p-2"
            data-atropos-offset="5"
          />
        </Atropos>
      </motion.div>
    </Backdrop>
  );
}