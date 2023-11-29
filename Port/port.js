const http = require('http');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Ruta al archivo CSV
const csvFilePath = path.join(__dirname, 'port.csv');

function leerDatosDesdeCSV() {
    const datos = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv({ separator: ';' })) // Especifica el separador como ';'
        .on('data', (row) => {
            const dato = {
                columna1: row['Tag Id'],
                columna2: row['Name'],
                columna3: row['cant'],
            };
            datos.push(dato);
        })
        .on('end', () => {
            io.emit('datosDesdeCSV', datos);
        });
}

// Lectura periódica de los datos del archivo CSV cada 2 segundos (ajusta según necesites)
setInterval(() => {
    leerDatosDesdeCSV();
}, 2000);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'port.html'));
});


io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(8000, () => {
    console.log('Servidor web en ejecución en http://localhost:8000');
});
