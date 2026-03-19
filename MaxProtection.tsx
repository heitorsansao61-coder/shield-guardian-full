import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert, ShieldCheck, Download, Globe, LogIn, AppWindow,
  FileWarning, Ban, CheckCircle, AlertTriangle, XCircle, Lock
} from "lucide-react";

interface BlockedEvent {
  id: string;
  type: "download" | "site" | "login" | "app";
  name: string;
  reason: string;
  timestamp: Date;
  severity: "blocked" | "warning" | "safe";
}

interface MaxProtectionProps {
  enabled: boolean;
  onToggle: () => void;
  onLog: (message: string, type: "info" | "warning" | "threat" | "success") => void;
}

const suspiciousDownloads = [
  { name: "free_movie_hd.exe", reason: "Arquivo executável disfarçado de vídeo" },
  { name: "crack_photoshop_2026.rar", reason: "Crack com malware embutido" },
  { name: "mod_menu_gta6.apk", reason: "APK com spyware detectado" },
  { name: "driver_booster_free.exe", reason: "PUP — software potencialmente indesejado" },
  { name: "whatsapp_gold.apk", reason: "App falso com trojan" },
  { name: "free_robux_generator.exe", reason: "Scam com keylogger" },
  { name: "netflix_premium_gratis.apk", reason: "App clonado com backdoor" },
  { name: "antivirus_gratis_2026.msi", reason: "Falso antivírus (rogue software)" },
];

const suspiciousSites = [
  { name: "fr33-m0vies.xyz", reason: "Site de phishing — rouba credenciais" },
  { name: "download-gratis.tk", reason: "Distribui malware via downloads" },
  { name: "login-bancobrasil.fake.com", reason: "Phishing bancário detectado" },
  { name: "ganhe-pix-agora.site", reason: "Golpe financeiro confirmado" },
  { name: "atualizar-whatsapp.link", reason: "Link falso de atualização" },
  { name: "sorteio-iphone16.promo", reason: "Scam — coleta dados pessoais" },
];

const suspiciousLogins = [
  { name: "Login em app desconhecido", reason: "App não verificado tentou acessar suas credenciais" },
  { name: "Login via link suspeito", reason: "Página de login falsa detectada" },
  { name: "Permissão de câmera/mic", reason: "App suspeito pediu acesso à câmera" },
  { name: "Acesso root solicitado", reason: "App tentou obter permissões de administrador" },
];

const suspiciousApps = [
  { name: "SpeedBooster Pro", reason: "Adware disfarçado de otimizador" },
  { name: "Battery Saver Ultra", reason: "Coleta dados em segundo plano" },
  { name: "Free VPN Master", reason: "Vende dados de navegação" },
  { name: "QR Scanner Plus", reason: "Contém código malicioso oculto" },
  { name: "Cleaner 360", reason: "Exibe propagandas invasivas" },
];

const typeConfig = {
  download: { icon: Download, label: "Download", color: "text-destructive" },
  site: { icon: Globe, label: "Site", color: "text-destructive" },
  login: { icon: LogIn, label: "Login", color: "text-warning" },
  app: { icon: AppWindow, label: "App", color: "text-warning" },
};

const MaxProtection = ({ enabled, onToggle, onLog }: MaxProtectionProps) => {
  const [blockedEvents, setBlockedEvents] = useState<BlockedEvent[]>([]);
  const [totalBlocked, setTotalBlocked] = useState(0);
  const [simulating, setSimulating] = useState(false);

  // Simulate blocking events when protection is enabled
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const rand = Math.random();
      let event: BlockedEvent;

      if (rand < 0.3) {
        const dl = suspiciousDownloads[Math.floor(Math.random() * suspiciousDownloads.length)];
        event = {
          id: Math.random().toString(36).substr(2, 9),
          type: "download",
          name: dl.name,
          reason: dl.reason,
          timestamp: new Date(),
          severity: "blocked",
        };
        onLog(`🛑 BLOQUEADO: Download "${dl.name}" — ${dl.reason}`, "threat");
      } else if (rand < 0.55) {
        const site = suspiciousSites[Math.floor(Math.random() * suspiciousSites.length)];
        event = {
          id: Math.random().toString(36).substr(2, 9),
          type: "site",
          name: site.name,
          reason: site.reason,
          timestamp: new Date(),
          severity: "blocked",
        };
        onLog(`🛑 BLOQUEADO: Site "${site.name}" — ${site.reason}`, "threat");
      } else if (rand < 0.8) {
        const login = suspiciousLogins[Math.floor(Math.random() * suspiciousLogins.length)];
        event = {
          id: Math.random().toString(36).substr(2, 9),
          type: "login",
          name: login.name,
          reason: login.reason,
          timestamp: new Date(),
          severity: "blocked",
        };
        onLog(`⚠ BLOQUEADO: ${login.name} — ${login.reason}`, "warning");
      } else {
        const app = suspiciousApps[Math.floor(Math.random() * suspiciousApps.length)];
        event = {
          id: Math.random().toString(36).substr(2, 9),
          type: "app",
          name: app.name,
          reason: app.reason,
          timestamp: new Date(),
          severity: "blocked",
        };
        onLog(`🛑 BLOQUEADO: App "${app.name}" — ${app.reason}`, "threat");
      }

      setBlockedEvents((prev) => [event, ...prev].slice(0, 50));
      setTotalBlocked((prev) => prev + 1);
    }, 4000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, [enabled, onLog]);

  const handleSimulateAttack = useCallback(() => {
    if (simulating || !enabled) return;
    setSimulating(true);

    const attacks = [
      { type: "download" as const, ...suspiciousDownloads[0] },
      { type: "site" as const, ...suspiciousSites[2] },
      { type: "app" as const, ...suspiciousApps[0] },
      { type: "login" as const, ...suspiciousLogins[0] },
      { type: "download" as const, ...suspiciousDownloads[4] },
    ];

    onLog("🔍 Simulação de ataque iniciada — testando proteções...", "info");

    attacks.forEach((attack, i) => {
      setTimeout(() => {
        const event: BlockedEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: attack.type,
          name: attack.name,
          reason: attack.reason,
          timestamp: new Date(),
          severity: "blocked",
        };
        setBlockedEvents((prev) => [event, ...prev].slice(0, 50));
        setTotalBlocked((prev) => prev + 1);
        onLog(`🛑 BLOQUEADO: ${attack.name} — ${attack.reason}`, "threat");

        if (i === attacks.length - 1) {
          setTimeout(() => {
            onLog("✅ Simulação concluída — todas as ameaças foram bloqueadas!", "success");
            setSimulating(false);
          }, 500);
        }
      }, (i + 1) * 800);
    });
  }, [enabled, simulating, onLog]);

  const protectionFeatures = [
    {
      icon: Download,
      title: "Bloqueio de Downloads",
      desc: "Bloqueia arquivos .exe, .apk e .msi suspeitos automaticamente",
      active: enabled,
    },
    {
      icon: Globe,
      title: "Verificação de Sites",
      desc: "Analisa URLs em tempo real e bloqueia phishing e golpes",
      active: enabled,
    },
    {
      icon: LogIn,
      title: "Proteção de Login",
      desc: "Impede logins em apps e sites não confiáveis",
      active: enabled,
    },
    {
      icon: AppWindow,
      title: "Bloqueio de Apps",
      desc: "Bloqueia instalação de aplicativos com malware ou adware",
      active: enabled,
    },
    {
      icon: FileWarning,
      title: "Anti-Phishing",
      desc: "Detecta mensagens e links fraudulentos automaticamente",
      active: enabled,
    },
    {
      icon: Lock,
      title: "Firewall Avançado",
      desc: "Monitora conexões de rede e bloqueia tráfego suspeito",
      active: enabled,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <div
        className={`rounded-lg border p-8 text-center transition-all ${
          enabled
            ? "border-primary/40 bg-primary/5 neon-border"
            : "border-border bg-card"
        }`}
      >
        <motion.div
          animate={enabled ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {enabled ? (
            <ShieldCheck size={64} className="mx-auto mb-4 text-primary neon-text" />
          ) : (
            <ShieldAlert size={64} className="mx-auto mb-4 text-muted-foreground" />
          )}
        </motion.div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Proteção Máxima
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
          {enabled
            ? "Todas as proteções estão ativas. Downloads suspeitos, sites falsos, logins perigosos e apps maliciosos serão bloqueados automaticamente."
            : "Ative para bloquear downloads perigosos, sites falsos, logins suspeitos e apps maliciosos em tempo real."}
        </p>

        {enabled && (
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-primary neon-text">
                {totalBlocked}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Bloqueados
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-primary neon-text">6</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Proteções
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-primary neon-text">100%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Cobertura
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button
            onClick={onToggle}
            className={`px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-all ${
              enabled
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-neon"
            }`}
          >
            {enabled ? "Desativar Proteção" : "⚡ Ativar Proteção Máxima"}
          </button>

          {enabled && (
            <button
              onClick={handleSimulateAttack}
              disabled={simulating}
              className="px-4 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all disabled:opacity-50"
            >
              {simulating ? "Simulando..." : "🧪 Simular Ataque"}
            </button>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {protectionFeatures.map((feature) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border p-4 transition-all ${
              feature.active
                ? "border-primary/20 bg-primary/5"
                : "border-border bg-card opacity-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <feature.icon
                size={20}
                className={feature.active ? "text-primary" : "text-muted-foreground"}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{feature.title}</p>
                  {feature.active ? (
                    <CheckCircle size={12} className="text-primary" />
                  ) : (
                    <XCircle size={12} className="text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Blocked Events Log */}
      {enabled && blockedEvents.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Ban size={14} /> Atividades Bloqueadas ({blockedEvents.length})
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <AnimatePresence>
              {blockedEvents.map((event) => {
                const config = typeConfig[event.type];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                  >
                    <Ban size={16} className="text-destructive shrink-0" />
                    <config.icon size={14} className={`${config.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {event.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {event.reason}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-destructive/20 text-destructive font-medium">
                        {config.label}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {enabled && blockedEvents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ShieldCheck size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Monitorando em tempo real... Nenhuma ameaça até agora.</p>
        </div>
      )}
    </div>
  );
};

export default MaxProtection;
