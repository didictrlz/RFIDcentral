const http = require('http');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const EsCsvFilePath = path.join(__dirname, 'datosEstaciones.csv');

// Ruta al archivo CSV
const csvFilePath = path.join(__dirname, 'Reto/tag_data_out.csv');

function leerDatosDesdeCSV() {
    const datos = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            datos.push(row.dato);
        })
        .on('end', () => {
            io.emit('datosDesdeCSV', datos); // Emitir datos a todos los clientes
        });
}

// Lectura periódica de los datos del archivo CSV cada 2 segundos (ajusta según necesites)
setInterval(() => {
    leerDatosDesdeCSV();
}, 2000);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'indexs.html'));
});


io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('datosEstaciones', (datos) => {
        if (datos && Array.isArray(datos) && datos.length === 4) {
            // Leer datos actuales del archivo CSV si existe
            let data = [];
            if (fs.existsSync(EsCsvFilePath)) {
                const fileContent = fs.readFileSync(EsCsvFilePath, 'utf-8');
                data = fileContent.split('\n').map(line => line.split(',').map(item => item.trim()));
            }

            // Agregar nuevos datos como una nueva fila al archivo CSV
            data.push(datos);

            // Construir el nuevo contenido del archivo CSV
            const newData = data.map(row => row.join(',')).join('\n');
            fs.writeFileSync(EsCsvFilePath, newData);

            console.log('Datos almacenados correctamente en el nuevo archivo CSV.');
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor web en ejecución en http://localhost:3000');
});