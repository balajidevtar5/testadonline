import React from "react";
import { Dialog, DialogProps, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface SmoothPopupProps extends Omit<DialogProps, "children"> {
  children: React.ReactNode;
  backgroundColor?: string;
  animationDuration?: number;
  isDarkMode?: boolean;
}

const SmoothPopup: React.FC<SmoothPopupProps> = ({
  children,
  backgroundColor = "#121212",
  animationDuration = 0.2,
  isDarkMode,
  ...dialogProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AnimatePresence>
      {dialogProps.open && (
        <Dialog
          {...dialogProps}
          PaperProps={{
            ...dialogProps.PaperProps,
            sx: {
              background: isDarkMode ? "dark" : "",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              borderRadius: isMobile ? "0px" : "8px",
              overflow: "hidden",
              paddingBottom: "env(safe-area-inset-bottom)",
              ...(dialogProps.PaperProps?.sx || {}),
              
            },
            component: motion.div,
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1, transition: { duration: animationDuration, ease: "easeOut" } },
            exit: { scale: 0.8, opacity: 0, transition: { duration: animationDuration, ease: "easeIn" } },
          }}
        >
          {/* Popup Content */}
          <motion.div
            style={{
              padding: "0px",
              position: "relative",
              zIndex: 1,
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.2 } }}
          >
            {children}
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SmoothPopup;
