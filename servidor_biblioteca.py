#!/usr/bin/env python3
"""Servidor da Biblioteca Kindle.
Abre o biblioteca.html com acesso aos arquivos dos livros, para o botão
"Enviar pelo WhatsApp" funcionar. Feche esta janela para desligar."""
import http.server, socket, os, sys, webbrowser, threading, json, subprocess

PORTA = 8765
PASTA = os.path.dirname(os.path.abspath(__file__))
PERMITIDO = ('/biblioteca.html', '/__biblioteca', '/Biblioteca/', '/dados/capas_sprites/')

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
        '.epub': 'application/epub+zip', '.webp': 'image/webp', '.html': 'text/html; charset=utf-8',
        '.mobi': 'application/x-mobipocket-ebook',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
    def __init__(self, *a, **k): super().__init__(*a, directory=PASTA, **k)
    def do_GET(self):
        p = self.path.split('?')[0]
        if p == '/': self.send_response(302); self.send_header('Location', '/biblioteca.html'); self.end_headers(); return
        if p == '/__biblioteca':
            self.send_response(200); self.send_header('Content-Type', 'text/plain'); self.end_headers(); self.wfile.write(b'ok'); return
        if not p.startswith(PERMITIDO) or p.endswith('/'): self.send_error(404); return
        super().do_GET()
    def do_POST(self):
        if self.path != '/__abrir' or self.headers.get('X-Biblioteca') != '1': self.send_error(404); return
        if self.client_address[0] not in ('127.0.0.1', '::1'): return self.responder(False, 'só funciona no próprio Mac')
        try:
            d = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))) or b'{}')
            base = os.path.realpath(os.path.join(PASTA, 'Biblioteca'))
            alvo = os.path.realpath(os.path.join(PASTA, d.get('path', '')))
            if not alvo.startswith(base + os.sep) or not os.path.isfile(alvo): return self.responder(False, 'arquivo não encontrado')
            subprocess.Popen(['open', '-R', alvo] if d.get('modo') == 'revelar' else ['open', alvo])
            self.responder(True)
        except Exception as e: self.responder(False, str(e))
    def responder(self, ok, erro=''):
        corpo = json.dumps({'ok': ok, 'erro': erro}).encode()
        self.send_response(200); self.send_header('Content-Type', 'application/json'); self.end_headers(); self.wfile.write(corpo)
    def log_message(self, *a): pass

def ip_local():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try: s.connect(('10.255.255.255', 1)); return s.getsockname()[0]
    except Exception: return None
    finally: s.close()

if __name__ == '__main__':
    srv = http.server.ThreadingHTTPServer(('0.0.0.0', PORTA), Handler)
    ip = ip_local()
    print('\n  Biblioteca Kindle ligada.\n')
    print(f'  No Mac:      http://localhost:{PORTA}')
    if ip: print(f'  No celular:  http://{ip}:{PORTA}   (mesma rede Wi-Fi)')
    print('\n  Para desligar, feche esta janela.\n')
    if '--sem-navegador' not in sys.argv:
        threading.Timer(0.8, lambda: webbrowser.open(f'http://localhost:{PORTA}')).start()
    try: srv.serve_forever()
    except KeyboardInterrupt: pass
