#!/bin/bash
# Liga a Biblioteca Kindle sozinha toda vez que o Mac inicia (rodar uma vez só).
PASTA="$(cd "$(dirname "$0")" && pwd)"
PY="$(command -v python3)"
PLIST="$HOME/Library/LaunchAgents/com.biblioteca.kindle.plist"
if [ -z "$PY" ]; then echo "Preciso do Python 3. Aceite instalar as ferramentas de desenvolvedor e rode de novo."; xcode-select --install; exit 1; fi
mkdir -p "$HOME/Library/LaunchAgents"
cat > "$PLIST" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.biblioteca.kindle</string>
  <key>ProgramArguments</key><array><string>$PY</string><string>$PASTA/servidor_biblioteca.py</string><string>--sem-navegador</string></array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardErrorPath</key><string>/tmp/biblioteca-kindle.log</string>
</dict></plist>
PL
launchctl bootout gui/$(id -u) "$PLIST" 2>/dev/null
pkill -f servidor_biblioteca.py 2>/dev/null
launchctl bootstrap gui/$(id -u) "$PLIST"
sleep 2
if curl -s http://localhost:8765/__biblioteca | grep -q ok; then
  echo; echo "  Pronto! A biblioteca agora fica ligada sozinha."
  echo "  Os botões do link publicado passam a abrir os livros aqui no Mac."
  echo "  Se o Mac perguntar se o python3 pode acessar a pasta Documentos, clique em Permitir."
  open "http://localhost:8765"
else
  echo "  Algo deu errado. Veja /tmp/biblioteca-kindle.log"
fi
