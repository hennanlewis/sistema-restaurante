import socket
import requests


def get_host_ip():
    try:
        host_name = socket.gethostname()
        endereco_ip = socket.gethostbyname(host_name)
        return endereco_ip
    except socket.error as e:
        print(f"Erro ao obter o endereço IP: {e}")
        return None

def set_new_ip(ip_adress):
    base_url = f"http://{ip_adress}:3000"
    data = { "ip": ip_adress, "restaurant": "Restaurante Sabor do Mar" }

    response = requests.put(f"{base_url}/api/link-acesso", json=data)

    if response.status_code // 100 == 2:
        return response.json().get("host")
    else:
        print(f"Erro na requisição POST. Código de resposta: {response.status_code}")
        print("Erro:", response.text)


if __name__ == "__main__":
    endereco_ip = get_host_ip()

    if endereco_ip:
        print(f"O endereço IP da sua máquina é: {endereco_ip}")
    else:
        print("Não foi possível obter o endereço IP.")