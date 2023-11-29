// operarios.mjs
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(bodyParser.urlencoded({ extended: true }));

// Servir el archivo HTML directamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'operarios.html'));
});
// Rutas para manejar las peticiones de los formularios
for (let i = 1; i <= 6; i++) {
    const estacion = `Estación ${i}`;

    app.post(`/nombreEstacion${i}`, (req, res) => {
        const nombre = req.body[`nombreEstacion${i}`];
        console.log(`Nombre ${estacion}: ${nombre}`);
        io.emit(`nombre${estacion}`, { message: `Nombre ${estacion}: ${nombre}` });
        res.status(200).json({ message: 'Datos recibidos correctamente.' });
    });

    app.post(`/codigoEstacion${i}`, (req, res) => {
        const codigo = req.body[`codigoEstacion${i}`];
        console.log(`Código ${estacion}: ${codigo}`);
        io.emit(`codigo${estacion}`, { message: `Código ${estacion}: ${codigo}` });
        res.status(200).json({ message: 'Datos recibidos correctamente.' });
    });
}

// Configuración del servidor Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    // Puedes realizar otras acciones cuando un cliente se conecta

    // Ejemplo de cómo enviar datos al cliente desde el servidor
    socket.emit('mensaje', '¡Conexión establecida con el servidor!');
});

// Ruta para servir el archivo resumen.html

app.get('/resumen', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumen.html')); // Utiliza 'path.join' para construir la ruta correctamente
});

app.get('/event-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Manejar la conexión y enviar eventos...
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
