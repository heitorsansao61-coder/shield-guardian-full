import os,sys,time,subprocess,re
from pathlib import Path

class BugFixer:
    def __init__(self,watch_dir="."):self.watch_dir=watch_dir;self.patterns=[r"undefined",r"null",r"error",r"exception"]
        def scan(self):
                for f in Path(self.watch_dir).rglob("*"):
                            if f.is_file() and f.suffix in [".py",".js",".ts",".java",".go",".rb",".php",".cpp"]:
                                            try:
                                                                c=f.read_text();[self.fix(f,p,c) for p in self.patterns if re.search(p,c,re.I)]
                                                                                except:pass
                                                                                    def fix(self,f,p,c):
                                                                                            fixes={r"undefined":"null",r"null":"0",r"error":"warning",r"exception":"try-except"}
                                                                                                    f.write_text(re.sub(p,fixes.get(p,p),c,flags=re.I))
                                                                                                            print(f"[FIXED] {f}:{p}")
                                                                                                                def run(self):
                                                                                                                        while True:self.scan();time.sleep(5)

                                                                                                                        if __name__=="__main__":
                                                                                                                            fixer=BugFixer("./src")
import socket

host="0.0.0.0"
port=5000
s=socket.socket()
s.bind((host,port))
s.listen()

print("Servidor rodando...")

while True:
    conn,addr=s.accept()
        print("Conectado:",addr)
            conn.send(b"Servidor ativo")
                conn.close()