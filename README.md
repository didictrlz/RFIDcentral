# RFIDcentral

Para la central los requerimientos son los siguientes:

- [x]  Acceso desde navegador web
- [x]  Login con codigo uninorte (creación de usuario)
- [ ]  Visualizacion de tiempos en tiempo real
- [ ]  Base de datos online provisional
- [x]  Generar xslx con los datos por práctica

El programa será capaz de mostrar la siguiente información:

- Datos del operario:
    - Nombre
    - Código
    - Duración de trabajo en tiempo real
    - Tiempo total de trabajo

- Recorrido de armado del avión
    - [ ]  Tiempo de armado en cada estación
    - [ ]  Por cual estación va
    - [ ]  Cuantos aviones hay en producción
    - [ ]  Notificar fallas

- Actualización en tiempo real de los aviones salientes
    - [x]  Contador de aviones que salen
    - [ ]  Contadores disponibles:
            - Defectuosos
            - No defectuoso
    - [ ]  Registro de datos de numero de aviones que salen tanto buenos como malos

// Portales nos debe decir si el avión salió defectuoso o no, identificando a través de cajas etiquetadas con rfid, una caja para defectuosos y una para no defectuosos

// Para actualizar el contador, hay una función que cuando llega un dato de web socket la pagina se actualiza
