import time
import os
import win32print
import win32ui
from PIL import Image, ImageWin

# Definição das constantes e configurações da impressora
HORZRES = 8
VERTRES = 10
LOGPIXELSX = 88
LOGPIXELSY = 90
PHYSICALWIDTH = 110
PHYSICALHEIGHT = 111
PHYSICALOFFSETX = 112
PHYSICALOFFSETY = 113

printer_name = win32print.GetDefaultPrinter()

# Função para imprimir um arquivo
def print_file(file_path):
    hDC = win32ui.CreateDC()
    hDC.CreatePrinterDC(printer_name)
    printable_area = hDC.GetDeviceCaps(HORZRES), hDC.GetDeviceCaps(VERTRES)
    printer_size = hDC.GetDeviceCaps(PHYSICALWIDTH), hDC.GetDeviceCaps(PHYSICALHEIGHT)
    printer_margins = hDC.GetDeviceCaps(PHYSICALOFFSETX), hDC.GetDeviceCaps(PHYSICALOFFSETY)

    bmp = Image.open(file_path)

    # Calculate the scaling factor to fit the image within the printable area
    ratios = [0.9 * printable_area[0] / bmp.size[0], 0.9 * printable_area[1] / bmp.size[1]]
    scale = min(ratios)

    # Calculate the offset to center the image on the page
    scaled_width, scaled_height = [int(scale * i) for i in bmp.size]
    x_offset = int((printer_size[0] - scaled_width) / 2) - printer_margins[0]
    y_offset = int((printer_size[1] - scaled_height) / 2) - printer_margins[1]

    # Start the print job, and draw the bitmap to the printer device at the scaled size
    hDC.StartDoc(file_path)
    hDC.StartPage()
    dib = ImageWin.Dib(bmp)
    x1 = 0
    y1 = 0
    x2 = x1 + scaled_width
    y2 = y1 + scaled_height
    dib.draw(hDC.GetHandleOutput(), (x1, y1, x2, y2))
    hDC.EndPage()
    hDC.EndDoc()
    hDC.DeleteDC()
    # Excluir o arquivo após a impressão
    os.remove(file_path)

# Função para listar arquivos em um diretório
def listar_arquivos(diretorio):
    # Lista todos os arquivos no diretório
    arquivos = os.listdir(diretorio)
    # Filtra apenas os arquivos (exclui diretórios)
    arquivos = [os.path.join(diretorio, arquivo) for arquivo in arquivos if os.path.isfile(os.path.join(diretorio, arquivo))]
    return arquivos

if __name__ == "__main__":
    diretorio = "sistema-restaurante/public/uploaded-images/"

    counter = 0
    print("Verificando novos arquivos...")

    # Loop infinito
    while True:
        arquivos = listar_arquivos(diretorio)
        # Verifica se há arquivos no diretório
        if arquivos:
            print(f"Encontrados {len(arquivos)} novos arquivos para impressão.")
            # Para cada arquivo, imprime e exclui
            for arquivo in arquivos:
                print(f"Imprimindo arquivo: {arquivo}")
                print_file(arquivo)
            print("Todos os arquivos foram impressos.")

        if counter == 0:
            print("Nenhum novo arquivo encontrado.")
        
        # Aguarda 3 segundos antes de verificar novamente
        time.sleep(3)
