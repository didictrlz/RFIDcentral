const http = require('http');
const fs = require('fs');
const readline = require('readline');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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

const popupPort = 3001;
const io = require('socket.io')(server);

// Configuración para escribir en el archivo CSV
const csvWriter = createCsvWriter({
    path: 'datos.csv',
    header: [
        { id: 'dato', title: 'Dato' }
    ],
    append: true
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function solicitarDatos() {
        rl.question('Ingresa datos (número) o "exit" para desconectar: ', (data) => {
            if (data.toLowerCase() === 'exit') {
                console.log('Desconectando...');
                socket.disconnect();
            } else {
                const parsedData = parseFloat(data);
                if (!isNaN(parsedData)) {
                    console.log(`Datos ingresados: ${parsedData}`);
                    socket.emit('datos', parsedData);

                    // Guardar el dato en el archivo CSV
                    csvWriter.writeRecords([{ dato: parsedData }])
                        .then(() => console.log('Dato guardado en el archivo CSV'));
                }
                solicitarDatos();
            }
        });
    }

    solicitarDatos();

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
        rl.close();
    });
});


