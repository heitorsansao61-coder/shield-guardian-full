import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "border-border",
  success: "border-primary/40 neon-border",
  warning: "border-warning/40 warning-glow",
  danger: "border-destructive/40 threat-glow",
};

const StatsCard = ({ icon: Icon, label, value, subtitle, variant = "default" }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border bg-card p-4 ${variantStyles[variant]}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon size={18} className="text-primary" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </motion.div>
  );
};

export default StatsCard;
