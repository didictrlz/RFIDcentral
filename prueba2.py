import csv
import pandas as pd
from sllurp.reader import R420
import keyboard

# Cargar los nombres de las etiquetas desde un archivo CSV a un DataFrame de Pandas
tag_names = pd.DataFrame(columns=['Tag ID', 'Name'])
try:
    tag_names = pd.read_csv('tag_names.csv', delimiter=';')  # Cambia el delimitador a ";"
except FileNotFoundError:
    print("El archivo CSV de nombres de etiquetas no existe. Se crearán nuevas asignaciones.")

def input_tag_name(tag_id):
    # Pide al usuario que ingrese un nombre para la etiqueta
    return input(f"Ingrese un nombre para la etiqueta con ID {tag_id}: ")

reader = R420('169.254.122.253')  # conectar al lector

# Crear un DataFrame de Pandas para almacenar los datos de las etiquetas
tag_data = pd.DataFrame(columns=['Tag ID', 'Name', 'Cantidad'])

# ... (resto del código)

while True:
    tags_before = reader.detectTags(powerDBm=15, antennas=(1,))
    for tag in tags_before:
        tag_id = tag['EPC-96'].decode('utf-8')
        tag_name_row = tag_names[tag_names['Tag ID'] == tag_id]
        if tag_name_row.empty:
            name = input_tag_name(tag_id)
            tag_names = tag_names.append({'Tag ID': tag_id, 'Name': name}, ignore_index=True)
            print(f"Tag ID: {tag_id}, Name: {name}")

        if tag_data[(tag_data['Tag ID'] == tag_id)].empty:
            tag_data = tag_data.append({'Tag ID': tag_id, 'Name': tag_name_row['Name'].values[0], 'Cantidad': 1}, ignore_index=True)
        else:
            tag_data.loc[tag_data['Tag ID'] == tag_id, 'Cantidad'] += 1

    # Detecta si se presiona la tecla 'X' para salir del bucle
    if keyboard.is_pressed('x'):
        print("Saliendo del bucle.")

        # Exporta los datos a archivos CSV con punto y coma como delimitador
        tag_names.to_csv('tag_names.csv', index=False, sep=';')
        tag_data.to_csv('tag_data.csv', index=False, sep=';')

        print("Datos exportados a tag_data.csv.")
        print("Nombres de etiquetas exportados a tag_names.csv.")
        break
    # ... (resto del código para cambiar el EPC)
