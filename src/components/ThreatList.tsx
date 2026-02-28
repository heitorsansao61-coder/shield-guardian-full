import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, Lock, Bug } from "lucide-react";
import { ThreatEntry, formatBytes } from "@/lib/antivirus-engine";

interface ThreatListProps {
  threats: ThreatEntry[];
  onQuarantine: (id: string) => void;
  onRemove: (id: string) => void;
}

const severityConfig = {
  low: { color: "text-muted-foreground", bg: "bg-muted", label: "Baixo" },
  medium: { color: "text-warning", bg: "bg-warning/10", label: "Médio" },
  high: { color: "text-destructive", bg: "bg-destructive/10", label: "Alto" },
  critical: { color: "text-destructive", bg: "bg-destructive/20", label: "Crítico" },
};

const ThreatList = ({ threats, onQuarantine, onRemove }: ThreatListProps) => {
  if (threats.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Bug size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Nenhuma ameaça detectada</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {threats.map((threat) => {
          const sev = severityConfig[threat.severity];
          return (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:border-destructive/30 transition-colors"
            >
              <AlertTriangle size={16} className={sev.color} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {threat.fileName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {threat.path}{threat.fileName} — {threat.threat}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${sev.bg} ${sev.color}`}>
                {sev.label}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {formatBytes(threat.size)}
              </span>
              <div className="flex gap-1">
                {threat.status === "detected" && (
                  <>
                    <button
                      onClick={() => onQuarantine(threat.id)}
                      className="p-1.5 rounded hover:bg-warning/10 text-warning transition-colors"
                      title="Quarentena"
                    >
                      <Lock size={14} />
                    </button>
                    <button
                      onClick={() => onRemove(threat.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                      title="Remover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
                {threat.status === "quarantined" && (
                  <span className="text-xs text-warning">Quarentena</span>
                )}
                {threat.status === "removed" && (
                  <span className="text-xs text-primary">Removido</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ThreatList;
