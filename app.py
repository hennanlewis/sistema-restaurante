import webview
import subprocess
import threading
import psutil
from python import ip

def open_webview(url):
    return webview.create_window("Restaurante Sabor do Mar", url)

def start_nextjs_server():
    result = subprocess.run(["run_server.bat"], shell=True, text=True)
    print(result.stdout)

def start_server_thread():
    print("Inicializando servidor Next.js...")
    nextjs_thread = threading.Thread(target=start_nextjs_server)
    nextjs_thread.start()

def list_processes():
    print("List of processes:")
    for process in psutil.process_iter(['pid', 'name']):
        print(process.info)

def list_processes_info():
    processes_info = []
    for process in psutil.process_iter(['pid', 'name']):
        processes_info.append((process.info['pid'], process.info['name']))
    return processes_info

def get_parent_process(pid):
    try:
        process = psutil.Process(pid)
        parent_process = process.parent()
        return parent_process
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
        return None

def calculate_difference(initial_processes, final_processes):
    return set(final_processes) - set(initial_processes)

def finish_processes(difference_processes):
    print("\nTerminating processes whose parent process is Node...")

    for pid, name in difference_processes:
        parent_process = get_parent_process(pid)
        if parent_process and parent_process.name() == 'node.exe':
            try:
                psutil.Process(pid).terminate()
                print(f"CMD process with PID {pid} terminated.")
            except psutil.NoSuchProcess as e:
                print(f"Error terminating CMD process with PID {pid}: {e}")

    print("\nTerminating Node or WebView processes...")
    for pid, name in difference_processes:
        if name in ['node.exe', 'msedgewebview2.exe']:
            try:
                psutil.Process(pid).terminate()
                print(f"Process with PID {pid} of {name} terminated.")
            except psutil.NoSuchProcess as e:
                print(f"Error terminating process with PID {pid}: {e}")


if __name__ == "__main__":
    initial_processes = list_processes_info()

    # start_server_thread()
    ip_adress = ip.get_host_ip()
    website_url = ip.set_new_ip(ip_adress)
    print("- Local:", website_url)
    window = open_webview(website_url)
    webview.start()

    final_processes = list_processes_info()
    difference_processes = calculate_difference(final_processes, initial_processes)

    finish_processes(difference_processes)
