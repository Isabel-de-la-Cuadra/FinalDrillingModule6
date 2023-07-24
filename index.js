/* 
Requerimientos:

1. Crear un servidor con Node.js
2. Crear un archivo principal llamado index.js
3. En un archivo aparte, llamado anime.json, guardar los datos con la información proporcionada
4. Crear un programa que permita hacer el CRUD completo de los datos. El id será el primer
argumento para acceder a las propiedades de cada anime.
5. Se deberá poder listar todos los datos del archivo y, además, leer los datos de un anime
especifico, accediendo por su id y / o por su nombre.
6. Realizar un test para poder probar la respuesta del servidor que fue creado.
*/

const http = require('http');
const fs = require('fs');
const url = require('url');

const dataPath = './anime.json';

const server = http.createServer((req, res) => {
    /* Set CORS headers to allow access from any origin (domain)
        It's important to configure the proper CORS headers on your server to ensure 
        security and correct operation when accessed from different domains or ports.
    */
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Parse the URL and extract the pathname and id from the query parameters
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    const { id } = parsedUrl.query;

    // Handle GET requests
    if (req.method === 'GET') {
        if (pathname === '/animes') {
            // Get all animes: http://localhost:3000/animes
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    // Error: Internal server error (Code 500)
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error reading data' }));
                } else {
                    const animes = JSON.parse(data);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(animes));
                }
            });
        } else if (pathname === '/animes/id' && id) {
            // Get anime by id: http://localhost:3000/animes/1
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    // Error: Internal server error (Code 500)
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error reading data' }));
                } else {
                    const animes = JSON.parse(data);
                    const anime = animes[id];
                    if (anime) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(anime));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Anime not found' }));
                    }
                }
            });
        } else if (pathname === '/animes/nombre' && id) {
            // Get anime by name
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    // Error: Internal server error (Code 500)
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error reading data' }));
                } else {
                    const animes = JSON.parse(data);
                    const anime = Object.values(animes).find(a => a.nombre.toLowerCase() === id.toLowerCase());
                    if (anime) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(anime));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Anime not found' }));
                    }
                }
            });
        } else {
            // Error Route not found (Code 404)
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    } else if (req.method === 'POST') {
        if (pathname === '/animes') {
            // Create a new anime
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                const newAnime = JSON.parse(body);
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        // Error writing data (Code 500)
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error reading data' }));
                    } else {
                        const animes = JSON.parse(data);
                        const newId = Object.keys(animes).length + 1;
                        newAnime.id = newId.toString();
                        animes[newId] = newAnime;
                        fs.writeFile(dataPath, JSON.stringify(animes, null, 2), (err) => {
                            if (err) {
                                // Error writing data (Code 500)
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Error writing data' }));
                            } else {
                                res.writeHead(201, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(newAnime));
                            }
                        });
                    }
                });
            });
        } else {
            // Error Route not found (Code 404)
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    } else if (req.method === 'PUT') {
        if (pathname === '/animes/id' && id) {
            // Update an anime by id
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                const updatedAnime = JSON.parse(body);
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        // Error reading data (Code 500)
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error reading data' }));
                    } else {
                        const animes = JSON.parse(data);
                        if (animes[id]) {
                            updatedAnime.id = id;
                            animes[id] = updatedAnime;
                            fs.writeFile(dataPath, JSON.stringify(animes, null, 2), (err) => {
                                if (err) {
                                    // Error writing data (Code 500)
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ error: 'Error writing data' }));
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify(updatedAnime));
                                }
                            });
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Anime not found' }));
                        }
                    }
                });
            });
        } else {
            // Error Route not found (Code 404)
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    } else if (req.method === 'DELETE') {
        if (pathname === '/animes/id' && id) {
            // Delete an anime by id
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    // Error reading data (Code 500)
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error reading data' }));
                } else {
                    const animes = JSON.parse(data);
                    if (animes[id]) {
                        const deletedAnime = animes[id];
                        delete animes[id];
                        fs.writeFile(dataPath, JSON.stringify(animes, null, 2), (err) => {
                            if (err) {
                                // Error writing data (Code 500)
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Error writing data' }));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(deletedAnime));
                            }
                        });
                    } else {
                        // Error Anime not found (Code 404)
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Anime not found' }));
                    }
                }
            });
        } else {
            // Error Route not found (Code 404)
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    } else {
        // Error Method not allowed (Code 405)
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
});

// Server initialization at the end of the code to make sure the server is fully configured before starting to receive requests
const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});