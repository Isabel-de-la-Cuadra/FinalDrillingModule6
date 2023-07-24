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

// Import required modules
const http = require('http');
const url = require('url');
const fs = require('fs');

//Port
const port = 3000;

// Read anime data from the JSON file
let animeData = []; // Create an empty array to store the anime data.

/* Use the fs.readFile() function to read the content of the 'anime.json' file in UTF-8 encoding.
This function takes three parameters:
1. The file path ('anime.json' in this case).
2. The encoding type ('utf8' in this case to read the file as a UTF-8 encoded string).
3. A callback function that will be executed after reading the file. It takes two parameters:
3.1.  err: An error object. If there's an error during file reading, it will contain the error details.
3.2.  data: The data read from the file as a string.
*/
fs.readFile('anime.json', 'utf8', (err, data) => {
    // Check if there is no error (err is null or undefined).
    if (!err) {
        /* If no error occurred, parse the data read from the file using JSON.parse().
        This will convert the JSON-formatted string into a JavaScript array or object.
        In this case, the data should be an array of anime objects in JSON format.
        */
        animeData = JSON.parse(data);
    }
    // If there was an error reading the file, the animeData array will remain empty.
});

// Function to find an anime by its ID. Example: Method: GET URL: http://localhost:3000/animes?id=1 (Replace 1 with the desired ID)
function findAnimeById(id) {
    /* Use the array method .find() to search for an anime in the animeData array
    whose 'id' property matches the provided 'id' parameter.
    The .find() method will return the first anime object that meets the condition,
    or 'undefined' if no match is found.
    */
    return animeData.find((anime) => anime.id === id);
}

// Function to find animes by their names. Example: Method: GET URL: http://localhost:3000/animes?nombre=Akira (Replace Akira with the desired name)
function findAnimesByName(name) {
    /* Use the array method .filter() to create a new array containing all the anime objects
    from the animeData array that have a 'nombre' (name) property matching the provided 'name' parameter.
    The .filter() method will return an array with all the matching anime objects.
    The comparison is case-insensitive, as both the 'nombre' property and the 'name' parameter
    are converted to lowercase using the .toLowerCase() method before the comparison.
    */
    return animeData.filter(
        (anime) => anime.nombre.toLowerCase() === name.toLowerCase()
    );
}

// Function to generate a new ID based on the length of the animeData
function generateNewId() {
    /* Calculate the new ID by adding 1 to the current length of the animeData array.
    Since arrays are zero-indexed, the new ID will be the length of the array plus 1.
    Convert the new ID to a string using the .toString() method before returning it.
    */
    return (animeData.length + 1).toString();
}

/* Function to add a new anime. Example: Method: POST URL: http://localhost:3000/animes
   Body -> raw + JSON format: Provide the anime data with the nombre, genero, año, and autor fields.
*/
function addAnime(newAnime) {
    /* Call the generateNewId() function to get a new ID for the new anime.
    Assign the new ID to the 'id' property of the newAnime object.
    */
    newAnime.id = generateNewId();

    /* Add the newAnime object to the animeData array using the .push() method.
    This will append the new anime to the end of the array.
    */
    animeData.push(newAnime);

    // After adding the new anime, call the saveAnimeData() function to save the updated animeData array to the 'anime.json' file.
    saveAnimeData();

    // Finally, return the newAnime object, which now includes the assigned ID.
    return newAnime;
}

/* Function to update an existing anime. Example: Method: PUT, http://localhost:3000/animes/1 (Replace 1 with the ID of the anime you want to update)
   Boby -> raw + JSON format: Provide the updated anime data with the nombre, genero, año, and autor fields.
*/
function updateAnime(id, updatedAnime) {
    /* Use the array method .findIndex() to find the index of the anime in the animeData array
    whose 'id' property matches the provided 'id' parameter.
    The .findIndex() method will return the index of the first anime that meets the condition,
    or -1 if no match is found.
    */
    const index = animeData.findIndex((anime) => anime.id === id);

    // Check if an anime with the given ID was found in the animeData array (index is not -1).
    if (index !== -1) {
        /* If an anime with the given ID was found, update its properties using object spread syntax.
        The updatedAnime object contains the new values for the properties that need to be updated.
        By using {...animeData[index], ...updatedAnime}, we create a new object that merges the existing anime properties
        with the updatedAnime properties. Any properties in updatedAnime will overwrite the existing ones.
        This ensures that only the specified properties are updated, and the rest remain unchanged. 
        BUT in the Create the server, part of the PUT method, the four parts of the object are forced
        to enter: name, genre, year and author
        */
        animeData[index] = {...animeData[index], ...updatedAnime };

        // After updating the anime, call the saveAnimeData() function to save the updated animeData array to the 'anime.json' file.
        saveAnimeData();

        // Finally, return the updated anime object, which now contains the new property values.
        return animeData[index];
    } else {
        // If no anime with the given ID was found, return null to indicate that the update was not successful.
        return null;
    }
}


/* Function to delete an anime by its ID. Example Method: DELETE 
URL: http://localhost:3000/animes/1 (Replace 1 with the ID of the anime you want to delete)
*/
function deleteAnime(id) {
    /* Use the array method .findIndex() to find the index of the anime in the animeData array
    whose 'id' property matches the provided 'id' parameter.
    The .findIndex() method will return the index of the first anime that meets the condition,
    or -1 if no match is found.
    */
    const index = animeData.findIndex((anime) => anime.id === id);

    // Check if an anime with the given ID was found in the animeData array (index is not -1).
    if (index !== -1) {
        /* If an anime with the given ID was found, use the .splice() method to remove the anime from the animeData array.
        The .splice() method takes the index of the element to remove (index) and the number of elements to remove (1).
        It returns an array containing the deleted elements, in this case, the deleted anime object.
        */
        const deletedAnime = animeData.splice(index, 1);

        // After deleting the anime, call the saveAnimeData() function to save the updated animeData array to the 'anime.json' file.
        saveAnimeData();

        /* Finally, return the deletedAnime, which is an array containing the deleted anime object.
        Since we removed only one element, the deletedAnime array will contain one element, and we return that element.
        */
        return deletedAnime[0];
    } else {
        // If no anime with the given ID was found, return null to indicate that the delete was not successful.
        return null;
    }
}


// Function to save the anime data to the JSON file
function saveAnimeData() {
    /* Log the current animeData array before saving it to the file for debugging purposes.
    This console.log statement will display the animeData array in the terminal.
    */
    console.log('Saving anime data:', animeData);

    /* Use the fs.writeFile() method to write the animeData array to the 'anime.json' file.
    The method takes the file path ('anime.json'), the data to write (JSON.stringify(animeData)),
    the encoding ('utf8'), and a callback function that will be called after the file is written.
    */
    fs.writeFile('anime.json', JSON.stringify(animeData), 'utf8', (err) => {
        if (err) {
            // If an error occurs during writing, log the error to the console.
            console.error('Error saving anime data:', err);
        } else {
            // If the file is written successfully, log a success message to the console.
            console.log('Anime data saved successfully.');
        }
    });
}

// Create the server
const server = http.createServer((req, res) => {
    // Parse the request URL to extract the URL components
    const parsedUrl = url.parse(req.url, true);
    console.log('Request URL:', parsedUrl);

    // Check if the request method is GET and the URL path is '/animes'
    if (req.method === 'GET' && parsedUrl.pathname === '/animes') {
        // Extract the query parameters from the URL
        const { id, nombre } = parsedUrl.query;
        console.log('ID:', id);
        console.log('Nombre:', nombre);

        // Check if the 'id' parameter is provided in the query
        if (id) {
            // Find the anime by its ID
            const animeById = findAnimeById(id);
            console.log('Anime by ID:', animeById);
            if (animeById) {
                // If the anime with the given ID is found, return it with a 200 OK status
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(animeById));
            } else {
                // If no anime with the given ID is found, return a 404 Not Found with an error message
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Anime not found.' }));
            }
            // Check if the 'nombre' parameter is provided in the query
        } else if (nombre) {
            // If the 'nombre' parameter is provided in the query, find animes by their names
            const animesByName = findAnimesByName(nombre);
            console.log('Animes by name:', animesByName);
            if (animesByName.length > 0) {
                // If animes with the given name are found, return them with a 200 OK status
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(animesByName));
            } else {
                // If no animes with the given name are found, return a 404 Not Found with an error message
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Anime not found.' }));
            }
        } else {
            // If no query parameters are provided, return the complete anime data with a 200 OK status. Example: Method: GET URL: http://localhost:3000/animes
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(animeData));
        }
    } else if (req.method === 'POST' && parsedUrl.pathname === '/animes') {
        // Extract the new anime data from the request body
        let requestBody = '';
        req.on('data', (chunk) => {
            requestBody += chunk.toString();
        });

        req.on('end', () => {
            const newAnime = JSON.parse(requestBody);
            console.log('New Anime:', newAnime);

            // Check if all required fields (nombre, genero, año, autor) are provided
            if (newAnime.nombre && newAnime.genero && newAnime.año && newAnime.autor) {
                // If all required fields are provided, add the new anime and return it with a 201 Created status
                const addedAnime = addAnime(newAnime);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(addedAnime));
            } else {
                // If any required field is missing, return a 400 Bad Request with an error message
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({ error: 'Incomplete data. Please provide all required fields.' })
                );
            }
        });
    } else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/animes/')) {
        // Extract the anime ID from the URL path
        const id = parsedUrl.pathname.split('/animes/')[1];
        console.log('Update Anime ID:', id);

        // Extract the updated anime data from the request body
        let requestBody = '';
        req.on('data', (chunk) => {
            requestBody += chunk.toString();
        });

        req.on('end', () => {
            const updatedAnime = JSON.parse(requestBody);
            console.log('Updated Anime:', updatedAnime);

            // Check if all required fields (nombre, genero, año, autor) are provided
            if (updatedAnime.nombre && updatedAnime.genero && updatedAnime.año && updatedAnime.autor) {
                // If all required fields are provided, update the existing anime and return it with a 200 OK status
                const updatedData = updateAnime(id, updatedAnime);
                if (updatedData) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(updatedData));
                } else {
                    // If no anime with the given ID is found, return a 404 Not Found with an error message
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Anime not found.' }));
                }
            } else {
                // If any required field is missing, return a 400 Bad Request with an error message
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({ error: 'Incomplete data. Please provide all required fields.' })
                );
            }
        });
    } else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/animes/')) {
        // Extract the anime ID from the URL path
        const id = parsedUrl.pathname.split('/animes/')[1];
        console.log('Delete Anime ID:', id);

        // Delete the anime with the given ID
        const deletedAnime = deleteAnime(id);
        if (deletedAnime) {
            // If the anime is deleted successfully, return it with a 200 OK status
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedAnime));
        } else {
            // If no anime with the given ID is found, return a 404 Not Found with an error message
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Anime not found.' }));
        }
    } else {
        // If none of the defined routes match, return a 404 Not Found with an error message
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found.' }));
    }
});


// Start the server on the defined port
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Export the server created to be able to use it in the test
module.exports = server;