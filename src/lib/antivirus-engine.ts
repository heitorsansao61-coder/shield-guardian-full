// NanoShield simulated antivirus engine

export interface ThreatEntry {
  id: string;
  fileName: string;
  path: string;
  threat: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "detected" | "quarantined" | "removed";
  timestamp: Date;
  size: number;
}

export interface ScanResult {
  filesScanned: number;
  threatsFound: ThreatEntry[];
  scanTime: number;
  scanType: "quick" | "full" | "custom";
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: "info" | "warning" | "threat" | "success";
}

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  networkActivity: number;
  protectionLevel: number;
  filesMonitored: number;
  threatsBlocked: number;
  lastScanDate: Date | null;
  engineVersion: string;
  databaseVersion: string;
  signaturesCount: number;
}

const threatNames = [
  "Trojan.GenericKD.47382",
  "Win32.CryptoMiner.Gen",
  "Adware.BrowserModifier",
  "PUP.Optional.SearchBar",
  "Ransom.WannaCry.Gen",
  "Backdoor.Agent.FX",
  "Worm.Conficker.B",
  "Rootkit.ZeroAccess",
  "Spyware.KeyLogger.AX",
  "Exploit.CVE-2024-1234",
];

const filePaths = [
  "C:\\Windows\\Temp\\",
  "C:\\Users\\Admin\\Downloads\\",
  "C:\\Program Files\\",
  "C:\\Users\\Admin\\AppData\\Roaming\\",
  "C:\\Windows\\System32\\",
  "D:\\Backup\\",
  "C:\\Users\\Admin\\Documents\\",
];

const fileNames = [
  "svchost_patch.exe", "update_helper.dll", "crack_v2.exe",
  "free_game.exe", "toolbar_setup.msi", "driver_update.exe",
  "codec_pack.exe", "keygen.exe", "activator.bat", "miner_x86.exe",
  "browser_ext.crx", "readme.scr", "invoice.pdf.exe", "photo.jpg.exe",
];

const cleanFiles = [
  "document.docx", "photo.jpg", "music.mp3", "video.mp4",
  "spreadsheet.xlsx", "presentation.pptx", "backup.zip",
  "config.ini", "readme.txt", "setup.cfg", "database.db",
  "index.html", "styles.css", "app.js", "package.json",
];

export function generateRandomThreat(): ThreatEntry {
  const severity = (["low", "medium", "high", "critical"] as const)[
    Math.floor(Math.random() * 4)
  ];
  return {
    id: Math.random().toString(36).substr(2, 9),
    fileName: fileNames[Math.floor(Math.random() * fileNames.length)],
    path: filePaths[Math.floor(Math.random() * filePaths.length)],
    threat: threatNames[Math.floor(Math.random() * threatNames.length)],
    severity,
    status: "detected",
    timestamp: new Date(),
    size: Math.floor(Math.random() * 5000000) + 10000,
  };
}

export function getRandomCleanFile(): string {
  return cleanFiles[Math.floor(Math.random() * cleanFiles.length)];
}

export function getRandomPath(): string {
  return filePaths[Math.floor(Math.random() * filePaths.length)];
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export function getInitialStats(): SystemStats {
  return {
    cpuUsage: 3 + Math.random() * 8,
    memoryUsage: 120 + Math.random() * 80,
    networkActivity: Math.random() * 5,
    protectionLevel: 100,
    filesMonitored: 148523,
    threatsBlocked: 47,
    lastScanDate: null,
    engineVersion: "4.2.1",
    databaseVersion: "2026.02.28",
    signaturesCount: 12847653,
  };
}
