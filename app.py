import webview
import subprocess
import threading

def open_webview(url):
    return webview.create_window("Restaurante Sabor do Mar", url)

def start_nextjs():
    resultado = subprocess.run(["run_server.bat"], shell=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
    print(resultado.stdout)

def subprocess_cmd():
    nextjs_thread = threading.Thread(target=start_nextjs)
    nextjs_thread.start()

def encerrar_processos():
    print("\nEncerrando processos cujo processo pai é Node...")
    
if __name__ == "__main__":
    subprocess_cmd()

    website_url = "http://localhost:3000"
    window = webview.create_window("Restaurante Sabor do Mar", website_url)
    webview.start()

    encerrar_processos()
