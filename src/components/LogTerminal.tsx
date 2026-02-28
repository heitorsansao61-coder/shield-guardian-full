import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LogEntry } from "@/lib/antivirus-engine";

interface LogTerminalProps {
  logs: LogEntry[];
  maxHeight?: string;
}

const typeColors = {
  info: "text-muted-foreground",
  warning: "text-warning",
  threat: "text-destructive",
  success: "text-primary",
};

const typePrefix = {
  info: "INFO",
  warning: "WARN",
  threat: "THREAT",
  success: "OK",
};

const LogTerminal = ({ logs, maxHeight = "300px" }: LogTerminalProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div
      className="rounded-lg border border-border bg-background/80 p-4 font-mono text-xs overflow-y-auto"
      style={{ maxHeight }}
    >
      {logs.length === 0 && (
        <p className="text-muted-foreground animate-pulse-neon">
          {">"} Aguardando atividade...
        </p>
      )}
      {logs.map((log, i) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02 }}
          className={`py-0.5 ${typeColors[log.type]}`}
        >
          <span className="text-muted-foreground">
            [{log.timestamp.toLocaleTimeString()}]
          </span>{" "}
          <span className="font-bold">[{typePrefix[log.type]}]</span>{" "}
          {log.message}
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default LogTerminal;
