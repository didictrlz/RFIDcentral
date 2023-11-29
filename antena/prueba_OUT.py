import csv
import pandas as pd
from sllurp.reader import R420
import keyboard
from datetime import datetime


dirección_ip="192.168.0.42"
# Cargar los nombres de las etiquetas desde un archivo CSV a un DataFrame de Pandas
tag_names_out= pd.DataFrame(columns=['Tag ID', 'Name', 'Cantidad'])
try:
    tag_names_out = pd.read_csv('tag_names_out.csv', delimiter=';')  # Cambia el delimitador a ";"
except FileNotFoundError:
    print("El archivo CSV de nombres de etiquetas no existe. Se crearán nuevas asignaciones.")

tag_names = pd.read_csv('tag_names.csv', delimiter=';')  # Cambia el delimitador a ";"

inventario_out= pd.DataFrame(columns=['Tag ID', 'Name', 'Cantidad','Última Actualización'])
try:
    inventario_out = pd.read_csv('inventario_out.csv', delimiter=';')  # Cambia el delimitador a ";"
except FileNotFoundError:
    print("El archivo CSV de nombres de etiquetas no existe. Se crearán nuevas asignaciones.")
    
tag_data = pd.read_csv('tag_data.csv', delimiter=';')  # Cambia el delimitador a ";"

tag_data_out = pd.DataFrame(columns=['Tag ID', 'Name', 'Cantidad'])
try:
    tag_data_out = pd.read_csv('tag_data_out.csv', delimiter=';')  # Cambia el delimitador a ";"
except FileNotFoundError:
    print("El archivo CSV de nombres de etiquetas no existe. Se crearán nuevas asignaciones.")

def input_tag_name(tag_id):
    # Pide al usuario que ingrese un nombre para la etiqueta
    return input(f"Ingrese un nombre para la etiqueta con ID {tag_id}: ")

# reader = R420('169.254.122.253')  # conectar al lector
reader = R420(dirección_ip)



# ... (resto del código)

while True:
    tags_before = reader.detectTags(powerDBm=18, antennas=(1,))
    for tag in tags_before:
        tag_id = tag['EPC-96'].decode('utf-8')
        tag_name_row_out = tag_names_out[tag_names_out['Tag ID'] == tag_id]
        tag_name_row = tag_names[tag_names['Tag ID'] == tag_id]
        if tag_name_row_out.empty and tag_name_row.empty:
            a=4
            # name = input_tag_name(tag_id)
            # tag_names_out = tag_names_out.append({'Tag ID': tag_id, 'Name': name, 'Cantidad': 1}, ignore_index=True)  ## Activar cuando se quiera añadir una etiqueta nueva
            # print(f"Tag ID: {tag_id}, Name: {name}")
        else:
            if not tag_data[(tag_data['Tag ID'] == tag_id)].empty:
                tag_data = tag_data[tag_data['Tag ID'] != tag_id]
                # if not tag_names[(tag_names['Tag ID'] == tag_id)].empty:
                #     name = tag_names_out[tag_names_out['Tag ID'] == tag_id]['Name'].values[0]
                #     tiempo_lectura = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Obtiene el tiempo actual
                    
                
            if tag_data_out[(tag_data_out['Tag ID'] == tag_id)].empty:
                if not tag_names_out[(tag_names_out['Tag ID'] == tag_id)].empty:
                    name = tag_names_out[tag_names_out['Tag ID'] == tag_id]['Name'].values[0]
                    tag_data_out = tag_data_out._append({'Tag ID': tag_id, 'Name':name, 'Cantidad': 1}, ignore_index=True)
                    tiempo_lectura = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Obtiene el tiempo actual
                    if inventario_out[(inventario_out['Name'] == name)].empty:                    
                        inventario_out= inventario_out._append({'Tag ID': tag_id, 'Name':name, 'Cantidad': 1, 'Última Actualización': tiempo_lectura}, ignore_index=True)
                    else:
                        inventario_out.loc[inventario_out['Name'] == name, 'Cantidad'] += 1
                        inventario_out.loc[inventario_out['Name'] == name, 'Última Actualización'] = tiempo_lectura
                
        inventario_out.to_csv('inventario_out.csv', index=False, sep=';')
        tag_names_out.to_csv('tag_names_out.csv', index=False, sep=';')
        # else:
        #     tag_data.loc[tag_data['Tag ID'] == tag_id, 'Cantidad'] += 1
        #         # Exporta los datos a archivos CSV con punto y coma como delimitador
        
        tag_data.to_csv('tag_data.csv', index=False, sep=';')
        tag_data_out.to_csv('tag_data_out.csv', index=False, sep=';')

    # Detecta si se presiona la tecla 'X' para salir del bucle
    if keyboard.is_pressed('x'):
        # print("Saliendo del bucle.")          

        tag_data_out = tag_data_out.iloc[0:0]
        # Guarda los encabezados en un nuevo archivo CSV
        tag_data_out.to_csv('tag_data_out.csv', index=False, sep=';')
        
        inventario_out = inventario_out.iloc[0:0]
        # Guarda los encabezados en un nuevo archivo CSV
        inventario_out.to_csv('inventario_out.csv', index=False, sep=';') 


        print("Datos exportados a tag_data.csv.")
        print("Nombres de etiquetas exportados a tag_names.csv.")
        break
    # ... (resto del código para cambiar el EPC)
