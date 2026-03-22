import ssl
import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain('localhost+1.pem', 'localhost+1-key.pem')

server = http.server.HTTPServer(('localhost', 443), http.server.SimpleHTTPRequestHandler)
server.socket = context.wrap_socket(server.socket, server_side=True)

print("Serveur HTTPS lancé → https://localhost")
server.serve_forever()