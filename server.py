import ssl
import os
import urllib.request
from http.server import HTTPServer, SimpleHTTPRequestHandler

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class ProxyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api":
            try:
                with urllib.request.urlopen("http://api.hothothot.dog/", timeout=5) as r:
                    data = r.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(data)
            except Exception:
                self.send_response(503)
                self.end_headers()
                self.wfile.write(b'{"error":"API indisponible"}')
        else:
            super().do_GET()

    def log_message(self, format, *args):
        pass

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain('localhost+1.pem', 'localhost+1-key.pem')

server = HTTPServer(('localhost', 443), ProxyHandler)
server.socket = context.wrap_socket(server.socket, server_side=True)

print("Serveur HTTPS lancé → https://localhost")
server.serve_forever()