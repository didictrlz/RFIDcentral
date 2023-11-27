const http = require('http');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const qs = require('querystring');

app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'op.html'));
});
// Objeto para almacenar los datos de las estaciones
const estaciones = {};

// Ruta para cada estación
// Ruta para cada estación
for (let i = 1; i <= 6; i++) {
    const nombreEstacion = `Estación ${i}`;
    estaciones[nombreEstacion] = {
        nombres: [],
        codigos: []
    };

    app.post(`/nombreEstacion${i}`, (req, res) => {
        const nuevoDato = req.body[`nombreEstacion${i}`]; // Utiliza el nombre del campo según el formulario
        if (nuevoDato) {
            estaciones[nombreEstacion].nombres.push(nuevoDato);
            console.log(`Nombre guardado en ${nombreEstacion}:`, nuevoDato);
            console.log(`Nombres almacenados en ${nombreEstacion}:`, estaciones[nombreEstacion].nombres);
            res.status(200).json({ message: `Nombre guardado en ${nombreEstacion} correctamente` });
        } else {
            res.status(400).json({ message: `Error al guardar el nombre en ${nombreEstacion}` });
        }
    });

    app.post(`/codigoEstacion${i}`, (req, res) => {
        const nuevoDato = req.body[`codigoEstacion${i}`]; // Utiliza el nombre del campo según el formulario
        if (nuevoDato) {
            estaciones[nombreEstacion].codigos.push(nuevoDato);
            console.log(`Código guardado en ${nombreEstacion}:`, nuevoDato);
            console.log(`Códigos almacenados en ${nombreEstacion}:`, estaciones[nombreEstacion].codigos);
            res.status(200).json({ message: `Código guardado en ${nombreEstacion} correctamente` });
        } else {
            res.status(400).json({ message: `Error al guardar el código en ${nombreEstacion}` });
        }
    });
}


server.listen(8000, () => {
    console.log('Servidor web en ejecución en http://localhost:8000');
});
