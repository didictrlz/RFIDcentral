import express from 'express';

import path from 'path';

import {fileURLToPath} from 'url';

import {methods as authentication} from "./controllers/authentication.controller.mjs"

const __dirname = path.dirname(fileURLToPath (import.meta.url));

//Servidor
const app = express();
const PORT = process.env.PORT || 3000;
app.set('port', 3000);
app.listen(app.get('port'));
app.use(express.json());
console.log(`Servidor en ejecución en http://localhost:${PORT}`);

//Configuración de atajos
app.use(express.static(__dirname + "/public"));


//Rutas de acceso
app.get("/",(req,res)=>res.sendFile(__dirname+"/login.html"))
app.get("/registro",(req,res)=>res.sendFile(__dirname+"/registro.html"))
app.get("/central", (req, res) => res.sendFile(__dirname+"/central/central.html"));
app.post("/api/registro", authentication.registro);
app.post("/api/login", (req, res) => {
    const { user, password } = req.body;
    // Verifica si user y password están presentes y no son cadenas vacías
    if (!user || !password || user.trim() === '' || password.trim() === '') {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' }); 
    }
});