import webview
import subprocess
import threading
import psutil

def open_webview(url):
    return webview.create_window("Restaurante Sabor do Mar", url)

def listar_processos():
    print("Lista de processos:")
    for processo in psutil.process_iter(['pid', 'name']):
        print(processo.info)

def start_nextjs():
    resultado = subprocess.run(["run_server.bat"], shell=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
    print(resultado.stdout)

def subprocess_cmd():
    nextjs_thread = threading.Thread(target=start_nextjs)
    nextjs_thread.start()

def listar_processos():
    processos = []
    for processo in psutil.process_iter(['pid', 'name']):
        processos.append((processo.info['pid'], processo.info['name']))
    return processos

def obter_processo_pai(pid):
    try:
        processo = psutil.Process(pid)
        processo_pai = processo.parent()
        return processo_pai
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
        return None

def encerrar_processos():
    print("\nEncerrando processos cujo processo pai é Node...")
    
    for processo in psutil.process_iter(['pid', 'name']):
        process_name = processo.info['name']
        processo_pai = obter_processo_pai(processo.info['pid'])
        if processo_pai and processo_pai.name() == 'node.exe':
            try:
                psutil.Process(processo.info['pid']).terminate()
                print(f"Processo CMD com PID {processo.info['pid']} encerrado.")
            except psutil.NoSuchProcess as e:
                print(f"Erro ao encerrar processo CMD com PID {processo.info['pid']}: {e}")
    
    print("\nEncerrando processos Node ou WebView...")
    for processo in psutil.process_iter(['pid', 'name']):
        process_name = processo.info['name']
        if process_name in ['node.exe', 'msedgewebview2.exe']:
            try:
                psutil.Process(processo.info['pid']).terminate()
                print(f"Processo com PID {processo.info['pid']} de {process_name} encerrado.")
            except psutil.NoSuchProcess as e:
                print(f"Erro ao encerrar processo com PID {processo.info['pid']}: {e}")


if __name__ == "__main__":
    # Lista de processos antes da execução do código
    processos_antes = listar_processos()

    subprocess_cmd()

    website_url = "http://localhost:3000"
    window = webview.create_window("Restaurante Sabor do Mar", website_url)
    webview.start()

    # Lista de processos depois da execução do código
    processos_depois = listar_processos()

    # Calcula a diferença entre os conjuntos de PIDs
    diferenca = set(processos_depois) - set(processos_antes)
    print("Diferença de processos:")
    for pid, nome in diferenca:
        print(f"PID: {pid}, Nome: {nome}")

    encerrar_processos()
