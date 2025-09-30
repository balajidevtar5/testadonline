import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedNumber = ({ count }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [showPlus, setShowPlus] = useState(false);

  useEffect(() => {
    const isPlus = typeof count === "string" && count.includes("+");
    const target = isPlus ? parseInt(count, 10) : Number(count);

    let current = 0;
    setDisplayValue(0);        // Reset before counting
    setShowPlus(false);        // Reset plus sign

    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        clearInterval(interval);
        setDisplayValue(target);
        setShowPlus(isPlus);
      } else {
        setDisplayValue(current);
      }
    }, 30); // adjust speed here

    return () => clearInterval(interval);
  }, [count]);

  return (
    <motion.span>
      {displayValue}
      {showPlus && '+'}
    </motion.span>
  );
};

export default AnimatedNumber;
