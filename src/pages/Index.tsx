import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Activity, Search, Brain, Terminal, Cpu, HardDrive,
  Wifi, FileWarning, ShieldCheck, Clock, Database, Zap, ChevronRight,
  Play, Square, RotateCcw, Eye
} from "lucide-react";
import ShieldLogo from "@/components/ShieldLogo";
import StatsCard from "@/components/StatsCard";
import LogTerminal from "@/components/LogTerminal";
import ScanProgress from "@/components/ScanProgress";
import ThreatList from "@/components/ThreatList";
import {
  LogEntry, ThreatEntry, SystemStats,
  generateRandomThreat, getRandomCleanFile, getRandomPath,
  getInitialStats, formatBytes
} from "@/lib/antivirus-engine";

type Tab = "dashboard" | "scan" | "smart" | "logs";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<SystemStats>(getInitialStats);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [threats, setThreats] = useState<ThreatEntry[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [smartMode, setSmartMode] = useState(false);
  const [engineOnline, setEngineOnline] = useState(true);
  const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev.slice(-200),
      { id: Math.random().toString(36).substr(2), timestamp: new Date(), message, type },
    ]);
  }, []);

  // Live stats update
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((s) => ({
        ...s,
        cpuUsage: Math.max(2, Math.min(95, s.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(80, Math.min(400, s.memoryUsage + (Math.random() - 0.5) * 20)),
        networkActivity: Math.max(0, Math.min(50, s.networkActivity + (Math.random() - 0.5) * 3)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initial log
  useEffect(() => {
    addLog("NanoShield Engine v4.2.1 inicializado", "success");
    addLog(`Base de assinaturas carregada: ${stats.signaturesCount.toLocaleString()} definições`, "info");
    addLog("Proteção em tempo real: ATIVA", "success");
    addLog("Monitoramento de rede: ATIVO", "info");
  }, []);

  const [scanComplete, setScanComplete] = useState(false);
  const [scanFoundThreats, setScanFoundThreats] = useState(false);

  const startScan = useCallback((type: "quick" | "full") => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setThreats([]);
    setScanComplete(false);
    setScanFoundThreats(false);

    const totalFiles = type === "quick" ? 50 : 150;
    const interval = type === "quick" ? 80 : 60;
    let scanned = 0;
    let foundAny = false;

    addLog(`Iniciando varredura ${type === "quick" ? "rápida" : "completa"}...`, "info");
    addLog("Verificando integridade dos arquivos do sistema...", "info");

    scanInterval.current = setInterval(() => {
      scanned++;
      const progress = (scanned / totalFiles) * 100;
      setScanProgress(progress);

      const fileName = getRandomCleanFile();
      const path = getRandomPath();
      setCurrentFile(`${path}${fileName}`);

      if (scanned % 10 === 0) {
        addLog(`Verificando: ${path}${fileName}`, "info");
      }
      if (scanned % 25 === 0) {
        addLog(`${scanned} arquivos verificados — sem ameaças até agora`, "info");
      }

      if (scanned >= totalFiles) {
        clearInterval(scanInterval.current!);
        setIsScanning(false);
        setScanProgress(100);
        setCurrentFile("");
        setScanComplete(true);
        setScanFoundThreats(foundAny);

        if (!foundAny) {
          addLog(`✅ Varredura concluída. ${scanned} arquivos verificados — Nenhum vírus encontrado!`, "success");
          addLog("Seu sistema está limpo e protegido.", "success");
        } else {
          addLog(`⚠ Varredura concluída. ${scanned} arquivos verificados — Ameaças encontradas!`, "threat");
        }

        setStats((s) => ({
          ...s,
          filesMonitored: s.filesMonitored + scanned,
          lastScanDate: new Date(),
        }));
      }
    }, interval);
  }, [isScanning, addLog]);

  const stopScan = useCallback(() => {
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      setIsScanning(false);
      addLog("Varredura interrompida pelo usuário.", "warning");
    }
  }, [addLog]);

  const handleQuarantine = useCallback((id: string) => {
    setThreats((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "quarantined" as const } : t))
    );
    addLog("Arquivo movido para quarentena.", "warning");
  }, [addLog]);

  const handleRemove = useCallback((id: string) => {
    setThreats((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "removed" as const } : t))
    );
    addLog("Ameaça removida com sucesso.", "success");
  }, [addLog]);

  const toggleSmartMode = useCallback(() => {
    setSmartMode((prev) => {
      const next = !prev;
      addLog(
        next ? "Modo Inteligente ATIVADO — Proteção adaptativa habilitada" : "Modo Inteligente DESATIVADO",
        next ? "success" : "warning"
      );
      return next;
    });
  }, [addLog]);

  const tabs: { id: Tab; icon: typeof Shield; label: string }[] = [
    { id: "dashboard", icon: Activity, label: "Dashboard" },
    { id: "scan", icon: Search, label: "Escaneamento" },
    { id: "smart", icon: Brain, label: "Modo Inteligente" },
    { id: "logs", icon: Terminal, label: "Logs" },
  ];

  const detectedThreats = threats.filter((t) => t.status === "detected").length;

  return (
    <div className="min-h-screen terminal-bg grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldLogo size={32} />
            <div>
              <h1 className="font-display text-lg font-bold text-foreground tracking-wider">
                NANOSHIELD
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Security Engine v4.2.1
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {smartMode && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded neon-text"
              >
                <Brain size={12} className="inline mr-1" />
                SMART
              </motion.span>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${engineOnline ? "bg-primary animate-pulse-neon" : "bg-destructive"}`} />
              <span className="text-xs text-muted-foreground">
                {engineOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary neon-text"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === "scan" && detectedThreats > 0 && (
                <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                  {detectedThreats}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Protection Banner */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 neon-border text-center">
                <ShieldLogo size={56} />
                <h2 className="font-display text-2xl font-bold text-foreground mt-4 neon-text">
                  SISTEMA PROTEGIDO
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Proteção em tempo real ativa · {stats.signaturesCount.toLocaleString()} assinaturas
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatsCard
                  icon={Cpu}
                  label="CPU"
                  value={`${stats.cpuUsage.toFixed(1)}%`}
                  subtitle="Uso do motor"
                  variant="success"
                />
                <StatsCard
                  icon={HardDrive}
                  label="Memória"
                  value={`${stats.memoryUsage.toFixed(0)} MB`}
                  subtitle="RAM utilizada"
                />
                <StatsCard
                  icon={Wifi}
                  label="Rede"
                  value={`${stats.networkActivity.toFixed(1)} KB/s`}
                  subtitle="Monitoramento ativo"
                />
                <StatsCard
                  icon={FileWarning}
                  label="Ameaças"
                  value={stats.threatsBlocked}
                  subtitle="Bloqueadas total"
                  variant={stats.threatsBlocked > 0 ? "warning" : "success"}
                />
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Proteção</span>
                  </div>
                  <p className="text-3xl font-display font-bold text-primary neon-text">{stats.protectionLevel}%</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Arquivos</span>
                  </div>
                  <p className="text-3xl font-display font-bold text-foreground">
                    {stats.filesMonitored.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Último Scan</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {stats.lastScanDate
                      ? stats.lastScanDate.toLocaleString("pt-BR")
                      : "Nenhum"}
                  </p>
                </div>
              </div>

              {/* Recent Logs */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <Terminal size={14} /> Atividade Recente
                </h3>
                <LogTerminal logs={logs.slice(-10)} maxHeight="180px" />
              </div>
            </motion.div>
          )}

          {activeTab === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Search size={20} className="text-primary" /> Escaneamento
                </h2>
                <ScanProgress progress={scanProgress} isScanning={isScanning} currentFile={currentFile} />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => startScan("quick")}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Zap size={16} /> Varredura Rápida
                  </button>
                  <button
                    onClick={() => startScan("full")}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    <Eye size={16} /> Varredura Completa
                  </button>
                  {isScanning && (
                    <button
                      onClick={stopScan}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:bg-destructive/90 transition-colors"
                    >
                      <Square size={16} /> Parar
                    </button>
                  )}
                </div>
              </div>

              {scanComplete && !scanFoundThreats && threats.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg border border-primary/30 bg-primary/5 neon-border p-8 text-center"
                >
                  <ShieldCheck size={56} className="mx-auto mb-4 text-primary neon-text" />
                  <h3 className="font-display text-xl font-bold text-primary neon-text mb-2">
                    Nenhum Vírus Encontrado!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Seu sistema está limpo e totalmente protegido. Todos os arquivos foram verificados.
                  </p>
                </motion.div>
              )}

              {threats.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <FileWarning size={14} /> Ameaças Detectadas ({threats.length})
                  </h3>
                  <ThreatList threats={threats} onQuarantine={handleQuarantine} onRemove={handleRemove} />
                </div>
              )}

              {!scanComplete && !isScanning && threats.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Search size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Inicie uma varredura para verificar seu sistema</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "smart" && (
            <motion.div
              key="smart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className={`rounded-lg border p-8 text-center transition-all ${
                smartMode ? "border-primary/40 bg-primary/5 neon-border" : "border-border bg-card"
              }`}>
                <Brain size={56} className={`mx-auto mb-4 ${smartMode ? "text-primary neon-text" : "text-muted-foreground"}`} />
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Modo Inteligente
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  Análise comportamental com IA para detectar ameaças desconhecidas.
                  Monitora processos, rede e arquivos em tempo real.
                </p>
                <button
                  onClick={toggleSmartMode}
                  className={`px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-all ${
                    smartMode
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {smartMode ? "Desativar" : "Ativar"}
                </button>
              </div>

              {smartMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {[
                    { label: "Análise Heurística", status: "Ativa", icon: Brain },
                    { label: "Sandbox Virtual", status: "Pronta", icon: Shield },
                    { label: "Firewall Inteligente", status: "Ativa", icon: Wifi },
                    { label: "Anti-Ransomware", status: "Monitorando", icon: FileWarning },
                  ].map((feature) => (
                    <div key={feature.label} className="rounded-lg border border-primary/20 bg-card p-4 flex items-center gap-3">
                      <feature.icon size={20} className="text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{feature.label}</p>
                        <p className="text-xs text-primary">{feature.status}</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "logs" && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Terminal size={20} className="text-primary" /> Logs do Sistema
                </h2>
                <button
                  onClick={() => setLogs([])}
                  className="flex items-center gap-1 px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground transition-colors border border-border"
                >
                  <RotateCcw size={12} /> Limpar
                </button>
              </div>
              <LogTerminal logs={logs} maxHeight="500px" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4">
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          NanoShield © 2026 — Proteção Máxima · Até 150MB por Arquivo
        </p>
      </footer>
    </div>
  );
};

export default Index;
