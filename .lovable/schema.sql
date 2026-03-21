CREATE TABLE security_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_language TEXT NOT NULL,
    hex_signature TEXT NOT NULL,
    analysis_status TEXT NOT NULL,
    record_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO security_records 
(source_language, hex_signature, analysis_status, record_type)
VALUES 
('Assembly','0xEFBEADDE','Malicious file detected','NEW');

INSERT INTO security_records 
(source_language, hex_signature, analysis_status, record_type)
VALUES 
('R','0xEFBEADDE','Previous threat signature stored','ARCHIVE');
