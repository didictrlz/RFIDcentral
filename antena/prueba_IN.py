import csv
import pandas as pd
from sllurp.reader import R420
import keyboard
from datetime import datetime


dirección_ip="192.168.0.44"
# Cargar los nombres de las etiquetas desde un archivo CSV a un DataFrame de Pandas
tag_names = pd.DataFrame(columns=['Tag ID', 'Name', 'Cantidad'])
try:
    tag_names = pd.read_csv('tag_names.csv', delimiter=';')  # Cambia el delimitador a ";"
except FileNotFoundError:
    print("El archivo CSV de nombres de etiquetas no existe. Se crearán nuevas asignaciones.")

inventario= pd.DataFrame(columns=['Tag ID', 'Name', 'Cantidad','Última Actualización'])
try:
    inventario = pd.read_csv('inventario.csv', delimiter=';')  # Cambia el delimitador a ";"
except FileNotFoundError:
    print("El archivo CSV de nombres de etiquetas no existe. Se crearán nuevas asignaciones.")


def input_tag_name(tag_id):
    # Pide al usuario que ingrese un nombre para la etiqueta
    return input(f"Ingrese un nombre para la etiqueta con ID {tag_id}: ")

tag_names_out = pd.DataFrame(columns=['Tag ID', 'Name', 'Cantidad'])

# reader = R420('169.254.122.253')  # conectar al lector
reader = R420(dirección_ip)

# Crear un DataFrame de Pandas para almacenar los datos de las etiquetas
tag_data = pd.DataFrame(columns=['Tag ID', 'Name', 'Cantidad'])

# ... (resto del código)

while True:
    tags_before = reader.detectTags(powerDBm=25, antennas=(1,))
    for tag in tags_before:
        tag_id = tag['EPC-96'].decode('utf-8')
        tag_name_row_out = tag_names_out[tag_names_out['Tag ID'] == tag_id]
        tag_name_row = tag_names[tag_names['Tag ID'] == tag_id]
        if tag_name_row.empty and tag_name_row_out.empty:
            a=4                                                 
            # name = input_tag_name(tag_id)
            # tag_names = tag_names.append({'Tag ID': tag_id, 'Name': name, 'Cantidad': 1}, ignore_index=True) ##Activar para guardar nueva ID
            # print(f"Tag ID: {tag_id}, Name: {name}")      ##Descomentar cuando se quieran añadir etiquetas
        
        else:
            if tag_data[(tag_data['Tag ID'] == tag_id)].empty:
                name = tag_names[tag_names['Tag ID'] == tag_id]['Name'].values[0]
                tag_data = tag_data._append({'Tag ID': tag_id, 'Name':name, 'Cantidad': 1}, ignore_index=True)
                tiempo_lectura = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Obtiene el tiempo actual
                if inventario[(inventario['Name'] == name)].empty:
                    
                    inventario= inventario._append({'Tag ID': tag_id, 'Name':name, 'Cantidad': 1, 'Última Actualización': tiempo_lectura}, ignore_index=True)
                else:
                    inventario.loc[inventario['Name'] == name, 'Cantidad'] += 1
                    inventario.loc[inventario['Name'] == name, 'Última Actualización'] = tiempo_lectura
                
        tag_names.to_csv('tag_names.csv', index=False, sep=';')
        inventario.to_csv('inventario.csv', index=False, sep=';')
        # else:
        #     tag_data.loc[tag_data['Tag ID'] == tag_id, 'Cantidad'] += 1
        #         # Exporta los datos a archivos CSV con punto y coma como delimitador
        
        tag_data.to_csv('tag_data.csv', index=False, sep=';')

    # Detecta si se presiona la tecla 'X' para salir del bucle
    if keyboard.is_pressed('x'):
        # print("Saliendo del bucle.")          

        tag_data = tag_data.iloc[0:0]
        # Guarda los encabezados en un nuevo archivo CSV
        tag_data.to_csv('tag_data.csv', index=False, sep=';')  

        inventario = inventario.iloc[0:0]
        # Guarda los encabezados en un nuevo archivo CSV
        inventario.to_csv('inventario.csv', index=False, sep=';')  ##Comentar cuando se quieran mantener los csv al terminar operaciones

        


        print("Proceso terminado")

        break
    # ... (resto del código para cambiar el EPC)
