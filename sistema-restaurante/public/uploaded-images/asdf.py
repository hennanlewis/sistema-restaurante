import win32print
import win32ui
import win32con

def print_to_default_printer(text):
    default_printer_name = win32print.GetDefaultPrinter()
    printer_handle = win32print.OpenPrinter(default_printer_name)
    
    try:
        hprinter = win32ui.CreateDC()
        hprinter.CreatePrinterDC(default_printer_name)
        hprinter.StartDoc('Test Document')
        hprinter.StartPage()
        hprinter.TextOut(100, 100, text)
        hprinter.EndPage()
        hprinter.EndDoc()
    finally:
        hprinter.DeleteDC()
        win32print.ClosePrinter(printer_handle)

if __name__ == "__main__":
    text_to_print = "Hello, this is a test print."
    print("asdf")
    print_to_default_printer(text_to_print)
