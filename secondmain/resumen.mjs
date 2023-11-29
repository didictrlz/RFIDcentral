import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';


const app = express();
const port = 3001;

// Obtén el directorio actual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Ruta para servir el archivo resumen.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumen.html'));
});

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor web de resumen en ejecución en http://localhost:${port}`);
});
