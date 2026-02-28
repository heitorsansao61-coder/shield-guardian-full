import { motion } from "framer-motion";

interface ScanProgressProps {
  progress: number;
  isScanning: boolean;
  currentFile?: string;
}

const ScanProgress = ({ progress, isScanning, currentFile }: ScanProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{isScanning ? "Escaneando..." : "Pronto"}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-muted overflow-hidden border border-border">
        <motion.div
          className="h-full rounded-full bg-primary relative"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        >
          {isScanning && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-[shimmer_1.5s_infinite]" />
          )}
        </motion.div>
      </div>
      {isScanning && currentFile && (
        <p className="text-xs text-muted-foreground font-mono truncate">
          {">"} {currentFile}
        </p>
      )}
    </div>
  );
};

export default ScanProgress;
