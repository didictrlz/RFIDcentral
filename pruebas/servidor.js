const http = require('http');
const fs = require('fs');
const readline = require('readline');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        const html = fs.readFileSync('index.html', 'utf8');
        res.end(html);
    }
});

server.listen(3000, () => {
    console.log('Servidor web en ejecución en http://localhost:3000');
});

const popupPort = 3001; // Puerto para la ventana emergente
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Ingresa datos (número): ', (data) => {
        const parsedData = parseFloat(data);
        if (!isNaN(parsedData)) {
            console.log(`Datos ingresados: ${parsedData}`);
            socket.emit('datos', parsedData);
        }
        rl.close();
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});