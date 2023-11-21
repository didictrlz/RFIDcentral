import csv
from sllurp.reader import R420
import keyboard

# Cargar los nombres de las etiquetas desde un archivo CSV a un diccionario
tag_names = {}
try:
    with open('tag_names.csv', mode='r', newline='') as file:
        reader = csv.reader(file, delimiter=';')  # Cambia el delimitador a ";"
        next(reader)  # Saltar la primera fila que contiene encabezados
        for row in reader:
            tag_id, tag_name = row
            tag_names[tag_id] = tag_name
except FileNotFoundError:
    print("El archivo CSV de nombres de etiquetas no existe. Se crearán nuevas asignaciones.")

def input_tag_name(tag_id):
    # Pide al usuario que ingrese un nombre para la etiqueta
    return input(f"Ingrese un nombre para la etiqueta con ID {tag_id}: ")

reader = R420('169.254.122.253')  # conectar al lector

# Crear una lista para almacenar los datos de las etiquetas
tag_data = []

# ... (resto del código)

while True:
    tags_before = reader.detectTags(powerDBm=15, antennas=(1,))
    for tag in tags_before:
        tag_id = tag['EPC-96'].decode('utf-8')
        tag_name = tag_names.get(tag_id, "Unknown")
        if tag_name == "Unknown":
            name = input_tag_name(tag_id)   
            tag_names[tag_id] = name
            print(f"Tag ID: {tag_id}, Name: {name}")
            
        with open('tag_names.csv', mode='w', newline='') as file:
            writer = csv.writer(file, delimiter=';')  # Cambia el delimitador a ";"
            writer.writerow(['Tag ID', 'Name'])
            for tag_id, tag_name in tag_names.items():
                writer.writerow([tag_id, tag_name])
        if not any(tag_id in row for row in tag_data):
            tag_data.append([tag_id, tag_name])

    # Detecta si se presiona la tecla 'X' para salir del bucle
    if keyboard.is_pressed('x'):
        print("Saliendo del bucle.")

        # Exporta los datos a un archivo CSV con punto y coma como delimitador
        with open('tag_data.csv', mode='w', newline='') as file:
            writer = csv.writer(file, delimiter=';')  # Cambia el delimitador a ";"
            writer.writerow(['Tag ID', 'Name'])
            writer.writerows(tag_data)


        print("Datos exportados a tag_data.csv.")
        print("Nombres de etiquetas exportados a tag_names.csv.")
        break
    # ... (resto del código para cambiar el EPC)
