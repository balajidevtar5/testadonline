import React from "react";
import { Dialog, DialogProps } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface BounncePopupProps extends Omit<DialogProps, "children"> {
  children: React.ReactNode;
  isDarkMode?: boolean;
  width?:string;
}

const bounceVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [0.2, 1.2, 1],
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const BounncePopup: React.FC<BounncePopupProps> = ({ children, width ,isDarkMode, ...dialogProps }) => {
  return (
    <AnimatePresence>
      {dialogProps.open && (
        <Dialog
          {...dialogProps}
          PaperProps={{
            sx: {
              width ,
              background: isDarkMode ? "dark" : "", 
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: isDarkMode 
                ? "0px 12px 24px rgba(0, 0, 0, 0.3)"
                : "0px 12px 24px rgba(0, 0, 0, 0.1)",
              p: 0,
            },
            component: motion.div,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            variants: bounceVariants,
          }}
        >
          <motion.div>
            <div style={{ color: isDarkMode ? "dark" : "" }}>
              {children}
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default BounncePopup;
