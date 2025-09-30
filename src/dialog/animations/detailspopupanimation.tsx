import React from "react";
import { Dialog, DialogProps } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface DetailsPopupProps extends Omit<DialogProps, "children"> {
  children: React.ReactNode;
  title: string;
}

const PopupAnimation: React.FC<DetailsPopupProps> = ({ children, title, ...dialogProps }) => {
  return (
    <AnimatePresence>
      {dialogProps.open && (
        <Dialog
          {...dialogProps}
          PaperProps={{
            ...dialogProps.PaperProps,
            sx: {
              background: "#1A1A1A",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              maxWidth: "600px",
              width: "90%",
              position: "relative", // Keeps it centered
            },
            component: motion.div,
            initial: { y: "-100vh", opacity: 0 }, // Start fully above the screen
            animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }, // Slide down smoothly
            exit: { y: "-100vh", opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }, // Slide up when closing
          }}
        >
          <motion.div
            style={{
              padding: "20px",
            }}
          >
            <div style={{ color: "#e0e0e0" }}>{children}</div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default PopupAnimation;
