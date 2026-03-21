// SECURITY ANALYSIS TOOL - Ferramenta de Análise de Segurança em Rust
// Suporta múltiplos idiomas: Português, Inglês, Espanhol, Francês, Alemão

use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::process::Command;
use chrono::Local;

#[derive(Clone)]
struct SecurityTool {
    language: String,
    threats: Vec<String>,
}

impl SecurityTool {
    fn new(language: &str) -> Self {
        SecurityTool {
            language: language.to_string(),
            threats: Vec::new(),
        }
    }

    fn get_messages(&self) -> HashMap<&'static str, HashMap<&'static str, &'static str>> {
        let mut messages: HashMap<&'static str, HashMap<&'static str, &'static str>> = HashMap::new();

        // Português
        let mut pt = HashMap::new();
        pt.insert("welcome", "🔒 Ferramenta de Segurança Multilíngue");
        pt.insert("scanning", "Escaneando sistema...");
        pt.insert("threats_found", "Ameaças encontradas:");
        pt.insert("no_threats", "Nenhuma ameaça detectada ✓");
        pt.insert("process_monitor", "Monitorando processos suspeitos...");
        pt.insert("browser_check", "Verificando extensões do navegador...");
        pt.insert("file_scan", "Escaneando arquivos...");
        pt.insert("report", "Relatório de Segurança");
        pt.insert("timestamp", "Data/Hora");
        pt.insert("language", "Idioma");
        pt.insert("threat_level", "Nível de Ameaça");
        pt.insert("critical", "CRÍTICO");
        pt.insert("high", "ALTO");
        pt.insert("medium", "MÉDIO");
        pt.insert("low", "BAIXO");
        pt.insert("registry_scan", "Escaneando registro do sistema...");
        pt.insert("network_check", "Verificando conexões de rede suspeitas...");
        pt.insert("startup_check", "Verificando programas de inicialização...");
        messages.insert("pt", pt);

        // Inglês
        let mut en = HashMap::new();
        en.insert("welcome", "🔒 Multilingual Security Tool");
        en.insert("scanning", "Scanning system...");
        en.insert("threats_found", "Threats found:");
        en.insert("no_threats", "No threats detected ✓");
        en.insert("process_monitor", "Monitoring suspicious processes...");
        en.insert("browser_check", "Checking browser extensions...");
        en.insert("file_scan", "Scanning files...");
        en.insert("report", "Security Report");
        en.insert("timestamp", "Timestamp");
        en.insert("language", "Language");
        en.insert("threat_level", "Threat Level");
        en.insert("critical", "CRITICAL");
        en.insert("high", "HIGH");
        en.insert("medium", "MEDIUM");
        en.insert("low", "LOW");
        en.insert("registry_scan", "Scanning system registry...");
        en.insert("network_check", "Checking suspicious network connections...");
        en.insert("startup_check", "Checking startup programs...");
        messages.insert("en", en);

        // Espanhol
        let mut es = HashMap::new();
        es.insert("welcome", "🔒 Herramienta de Seguridad Multilingüe");
        es.insert("scanning", "Escaneando sistema...");
        es.insert("threats_found", "Amenazas encontradas:");
        es.insert("no_threats", "Sin amenazas detectadas ✓");
        es.insert("process_monitor", "Monitoreando procesos sospechosos...");
        es.insert("browser_check", "Verificando extensiones del navegador...");
        es.insert("file_scan", "Escaneando archivos...");
        es.insert("report", "Informe de Seguridad");
        es.insert("timestamp", "Marca de tiempo");
        es.insert("language", "Idioma");
        es.insert("threat_level", "Nivel de Amenaza");
        es.insert("critical", "CRÍTICO");
        es.insert("high", "ALTO");
        es.insert("medium", "MEDIO");
        es.insert("low", "BAJO");
        es.insert("registry_scan", "Escaneando registro del sistema...");
        es.insert("network_check", "Verificando conexiones de red sospechosas...");
        es.insert("startup_check", "Verificando programas de inicio...");
        messages.insert("es", es);

        // Francês
        let mut fr = HashMap::new();
        fr.insert("welcome", "🔒 Outil de Sécurité Multilingue");
        fr.insert("scanning", "Numérisation du système...");
        fr.insert("threats_found", "Menaces détectées:");
        fr.insert("no_threats", "Aucune menace détectée ✓");
        fr.insert("process_monitor", "Surveillance des processus suspects...");
        fr.insert("browser_check", "Vérification des extensions du navigateur...");
        fr.insert("file_scan", "Numérisation des fichiers...");
        fr.insert("report", "Rapport de Sécurité");
        fr.insert("timestamp", "Horodatage");
        fr.insert("language", "Langue");
        fr.insert("threat_level", "Niveau de Menace");
        fr.insert("critical", "CRITIQUE");
        fr.insert("high", "ÉLEVÉ");
        fr.insert("medium", "MOYEN");
        fr.insert("low", "FAIBLE");
        fr.insert("registry_scan", "Numérisation du registre système...");
        fr.insert("network_check", "Vérification des connexions réseau suspectes...");
        fr.insert("startup_check", "Vérification des programmes de démarrage...");
        messages.insert("fr", fr);

        // Alemão
        let mut de = HashMap::new();
        de.insert("welcome", "🔒 Mehrsprachiges Sicherheitstool");
        de.insert("scanning", "System wird gescannt...");
        de.insert("threats_found", "Bedrohungen gefunden:");
        de.insert("no_threats", "Keine Bedrohungen erkannt ✓");
        de.insert("process_monitor", "Überwachung verdächtiger Prozesse...");
        de.insert("browser_check", "Überprüfung von Browser-Erweiterungen...");
        de.insert("file_scan", "Dateien werden gescannt...");
        de.insert("report", "Sicherheitsbericht");
        de.insert("timestamp", "Zeitstempel");
        de.insert("language", "Sprache");
        de.insert("threat_level", "Bedrohungsstufe");
        de.insert("critical", "KRITISCH");
        de.insert("high", "HOCH");
        de.insert("medium", "MITTEL");
        de.insert("low", "NIEDRIG");
        de.insert("registry_scan", "Systemregistrierung wird gescannt...");
        de.insert("network_check", "Verdächtige Netzwerkverbindungen werden überprüft...");
        de.insert("startup_check", "Startprogramme werden überprüft...");
        messages.insert("de", de);

        messages
    }

    fn get_message(&self, key: &str) -> String {
        let messages = self.get_messages();
        let lang_messages = messages.get(self.language.as_str())
            .or_else(|| messages.get("en"))
            .unwrap();
        
        lang_messages.get(key)
            .unwrap_or(&"Unknown")
            .to_string()
    }

    fn scan_files(&mut self, directory: &str) -> Vec<String> {
        println!("\n{}", self.get_message("file_scan"));
        let mut suspicious_files = Vec::new();
        
        if let Ok(entries) = fs::read_dir(directory) {
            for entry in entries.flatten() {
                if let Ok(metadata) = entry.metadata() {
                    if metadata.is_file() {
                        let path = entry.path();
                        if let Some(file_name) = path.file_name() {
                            let name = file_name.to_string_lossy().to_string();
                            
                            // Verifica extensões suspeitas
                            let suspicious_extensions = vec![
                                ".exe", ".bat", ".cmd", ".scr", ".vbs", ".js",
                                ".com", ".pif", ".ps1", ".dll", ".sys"
                            ];
                            
                            for ext in suspicious_extensions {
                                if name.ends_with(ext) {
                                    let threat = format!("Arquivo suspeito detectado: {} (Extensão: {})", name, ext);
                                    self.threats.push(threat.clone());
                                    suspicious_files.push(threat);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        suspicious_files
    }

    fn monitor_processes(&mut self) -> Vec<String> {
        println!("\n{}", self.get_message("process_monitor"));
        let mut suspicious_processes = Vec::new();
        
        #[cfg(target_os = "windows")]
        {
            if let Ok(output) = Command::new("tasklist")
                .output() {
                let tasklist = String::from_utf8_lossy(&output.stdout);
                let suspicious_names = vec![
                    "cmd.exe", "powershell.exe", "taskkill.exe", "wscript.exe",
                    "cscript.exe", "regsvcs.exe", "rundll32.exe", "svchost.exe"
                ];
                
                for line in tasklist.lines() {
                    for suspect in &suspicious_names {
                        if line.contains(suspect) {
                            let threat = format!("Processo suspeito: {}", line.trim());
                            self.threats.push(threat.clone());
                            suspicious_processes.push(threat);
                        }
                    }
                }
            }
        }
        
        #[cfg(not(target_os = "windows"))]
        {
            if let Ok(output) = Command::new("ps")
                .arg("aux")
                .output() {
                let ps_output = String::from_utf8_lossy(&output.stdout);
                let suspicious_names = vec![
                    "bash", "sh", "curl", "wget", "nc", "netcat"
                ];
                
                for line in ps_output.lines() {
                    for suspect in &suspicious_names {
                        if line.contains(suspect) && !line.contains("grep") {
                            let threat = format!("Processo suspeito: {}", line.trim());
                            self.threats.push(threat.clone());
                            suspicious_processes.push(threat);
                        }
                    }
                }
            }
        }
        
        suspicious_processes
    }

    fn check_browser_extensions(&mut self) -> Vec<String> {
        println!("\n{}", self.get_message("browser_check"));
        let mut extensions = Vec::new();
        
        let chrome_path = if cfg!(target_os = "windows") {
            format!("{}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions", 
                    std::env::var("USERPROFILE").unwrap_or_default())
        } else {
            format!("{}/.config/google-chrome/Default/Extensions", 
                    std::env::var("HOME").unwrap_or_default())
        };
        
        if let Ok(entries) = fs::read_dir(&chrome_path) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    if let Some(ext_id) = path.file_name() {
                        let threat = format!("Extensão detectada: {}", ext_id.to_string_lossy());
                        self.threats.push(threat.clone());
                        extensions.push(threat);
                    }
                }
            }
        }
        
        extensions
    }

    fn network_check(&mut self) -> Vec<String> {
        println!("\n{}", self.get_message("network_check"));
        let mut connections = Vec::new();
        
        #[cfg(target_os = "windows")]
        {
            if let Ok(output) = Command::new("netstat")
                .arg("-an")
                .output() {
                let netstat = String::from_utf8_lossy(&output.stdout);
                for line in netstat.lines() {
                    if line.contains("ESTABLISHED") {
                        let threat = format!("Conexão: {}", line.trim());
                        self.threats.push(threat.clone());
                        connections.push(threat);
                    }
                }
            }
        }
        
        connections
    }

    fn generate_report(&self) {
        println!("\n{}", "=".repeat(70));
        println!("📊 {}", self.get_message("report"));
        println!("{}", "=".repeat(70));
        println!("{}: {}", self.get_message("timestamp"), Local::now().format("%Y-%m-%d %H:%M:%S"));
        println!("{}: {}", self.get_message("language"), self.language.to_uppercase());
        
        if !self.threats.is_empty() {
            println!("\n⚠️  {} {}", self.get_message("threats_found"), self.threats.len());
            for (i, threat) in self.threats.iter().enumerate() {
                println!("  {}. {}", i + 1, threat);
            }
        } else {
            println!("\n✅ {}", self.get_message("no_threats"));
        }
        
        println!("{}\n", "=".repeat(70));
    }

    fn full_scan(&mut self, directory: &str) {
        println!("\n🔐 {}", self.get_message("welcome"));
        println!("{}\n", self.get_message("scanning"));
        
        self.scan_files(directory);
        self.monitor_processes();
        self.check_browser_extensions();
        self.network_check();
        
        self.generate_report();
    }
}

fn main() {
    println!("Selecione o idioma / Select language:");
    println!("1. Português (PT)");
    println!("2. English (EN)");
    println!("3. Español (ES)");
    println!("4. Français (FR)");
    println!("5. Deutsch (DE)\n");
    
    println!("Escolha / Choose (1-5):");
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    
    let language = match input.trim() {
        "1" => "pt",
        "2" => "en",
        "3" => "es",
        "4" => "fr",
        "5" => "de",
        _ => "en",
    };
    
    let mut tool = SecurityTool::new(language);
    tool.full_scan(".");
}use std::fs;
fn main(){
 let p="/home";
  if let Ok(d)=fs::read_dir(p){
    for f in d{
       let n=f.unwrap().file_name().into_string().unwrap();
          if n.ends_with(".exe")||n.ends_with(".sh"){
              println!("suspeito: {}",n);
                 }else{
                     println!("ok: {}",n);
                        }
                          }
                           }
                           }
