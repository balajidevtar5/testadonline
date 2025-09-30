import { motion } from "framer-motion";

export const UnfoldingAnimation = ({ children, ...props }) => {
    return (
        <motion.div
        initial={{ scaleY: 0.01, scaleX: 0 }} // Start as a thin line
        animate={{
          scaleX: 1, // Expand horizontally
          transition: { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] },
        }}
        onAnimationComplete={() => {
          // Trigger modal zoom animation after unfolding
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { duration: 0.5, delay: 0.5, ease: [0.165, 0.84, 0.44, 1] } }} // Zoom in after unfolding
          exit={{ scale: 0, transition: { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] } }} // Shrink back when closing
          style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  };
  