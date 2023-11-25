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
const csvFilePath = path.join(__dirname, 'datos.csv');

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
    res.sendFile(path.join(__dirname, 'index.html'));
});


io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('datosEstaciones', (dato1, dato2, dato3, dato4) => {
        const nuevaFila = `${dato1},${dato2},${dato3},${dato4}\n`;
    
        fs.appendFile(EsCsvFilePath, nuevaFila, (err) => {
            if (err) {
                console.error('Error al escribir en el archivo CSV:', err);
            } else {
                console.log('Datos almacenados correctamente en el archivo CSV.');
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor web en ejecución en http://localhost:3000');
});
