import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface ShieldLogoProps {
  size?: number;
  animate?: boolean;
}

const ShieldLogo = ({ size = 40, animate = true }: ShieldLogoProps) => {
  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      animate={animate ? { scale: [1, 1.05, 1] } : undefined}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
      <Shield size={size} className="text-primary neon-text relative z-10" strokeWidth={1.5} />
    </motion.div>
  );
};

export default ShieldLogo;
