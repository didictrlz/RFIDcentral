import express from 'express';

import mongoose from 'mongoose';

import mysql from 'mysql2';

import path from 'path';

import {fileURLToPath} from 'url';

import {methods as authentication} from "./controllers/authentication.controller.mjs";

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import bodyParser from 'body-parser';
//import operariosApp from './1_public/operarios.mjs';

const __dirname = path.dirname(fileURLToPath (import.meta.url));

mongoose.connect('mongodb://localhost:27017/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Servidor
const app = express();
const PORT = process.env.PORT || 5000;
app.set('port', 5000);
app.listen(app.get('port'));
app.use(express.json());

console.log(`Servidor en ejecución en http://localhost:${PORT}`);

//Configuración de atajos
app.use(express.static(__dirname + "/public"));

//Rutas de acceso
app.get("/",(req,res)=>res.sendFile(__dirname+"/login.html"))
app.get("/registro",(req,res)=>res.sendFile(__dirname+"/registro.html"))
app.get("/operarios", (req, res) => res.sendFile("/Users/Sarah/Desktop/Semestre 7/Comu/Reto_FFID4ALL/Reto_comu/secondmain/operarios.html"));
app.get("/resumen",(req,res)=>res.sendFile(__dirname+"/resumen.html"))
app.get("/portales",(req,res)=>res.sendFile(__dirname+"/portales.html"))
app.post("/api/registro", authentication.registro);
app.post("/api/login", authentication.login);

const db_picking = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Retocomu2023',
  database: 'pick_it',
  insecureAuth: true, // Agrega esta línea para permitir la autenticación antigua
});

db_picking.connect((err) => {
  if (err) {
      console.error('Error al conectar a la base de datos:', err);
  } else {
      console.log('Conexión exitosa a la base de datos');
  }
});

app.get('/picking', (req, res) => {
  // Realiza la consulta a la base de datos
  db_picking.query('SELECT * FROM pick_it.kits', (error, results) => {
    if (error) throw error;

    // Construir el HTML directamente en la respuesta
    let htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Picking</title>
        <link rel="icon" href="data:;base64,iVBORw0KGgo=">
        <link rel="stylesheet" href="style2.css">
      </head>
      <body>
        <h1>Información desde la Base de Datos</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kits</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
  `;

  // Agregar cada elemento de la base de datos a la tabla
  results.forEach(item => {
    htmlResponse += `
      <tr>
        <td>${item.id}</td>
        <td>${item.kits}</td>
        <td>${item.cantidad}</td>
      </tr>
    `;
  });

  // Cerrar el HTML
  htmlResponse += `
          </tbody>
        </table>
      </body>
    </html>
  `;

  // Enviar la respuesta HTML completa
  res.send(htmlResponse);
});
});

const __filename = fileURLToPath(import.meta.url);


const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(bodyParser.urlencoded({ extended: true }));

// Servir el archivo HTML directamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'operarios.html'));
});
// Rutas para manejar las peticiones de los formularios const estacion = `Estación ${i}`;

// Fuera del bucle for, antes de la definición de rutas
let todosLosNombres = [];
let todosLosCodigos = [];

for (let i = 1; i <= 6; i++) {
  const estacion = `Estacion ${i}`;

  app.post(`/nombreEstacion${i}`, (req, res) => {
    const nombreActual = req.body[`nombreEstacion${i}`];
    console.log(`Nombre ${estacion}: ${nombreActual}`);
    todosLosNombres.push({ estacion, nombre: nombreActual }); // Guardar el nombre en el array
    io.emit(`nombre${estacion}`, { message: `Nombre ${estacion}: ${nombreActual}` });
    res.status(200).json({ message: 'Datos recibidos correctamente.' });
  });

  app.post(`/codigoEstacion${i}`, (req, res) => {
    const codigoActual = req.body[`codigoEstacion${i}`];
    console.log(`Código ${estacion}: ${codigoActual}`);
    todosLosCodigos.push({ estacion, codigo: codigoActual }); // Guardar el código en el array
    io.emit(`codigo${estacion}`, { message: `Código ${estacion}: ${codigoActual}` });
    res.status(200).json({ message: 'Datos recibidos correctamente.' });
  });
}

// Configuración del servidor Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');
});

// portales
app.get('/', (req, res) => {
  // Configuración de cabeceras CORS (permisos de origen cruzado)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  const csvFilePath = 'port.csv';  // Reemplaza con la ruta correcta a tu archivo CSV

  function enviarDatosAlCliente() {
    const datos = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const dato = {
          columna1: row['Tag Id'],
          columna2: row['Name'],
          columna3: row['cant'],
        };
        datos.push(dato);
      })
      .on('end', () => {
        res.write(`data: ${JSON.stringify(datos)}\n\n`);
      });
  }

  // Enviar datos al cliente cada 2 segundos (ajusta según sea necesario)
  setInterval(enviarDatosAlCliente, 2000);
});
