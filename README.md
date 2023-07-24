# FinalDrillingModule6

Proyecto final del módulo 6 del Bootcamp Desarrollo de Aplicaciones Full Stack JavaScript Trainee V2.0 Botic-Sofof-222-02-02-0023  de Edutecno.

Requerimientos iniciales:
1. Crear un servidor con Node.js
2. Crear un archivo principal llamado index.js
3. En un archivo aparte, llamado anime.json, guardar los datos con la información proporcionada
4. Crear un programa que permita hacer el CRUD completo de los datos. El id será el primer
argumento para acceder a las propiedades de cada anime.
5. Se deberá poder listar todos los datos del archivo y, además, leer los datos de un anime
especifico, accediendo por su id y / o por su nombre.
6. Realizar un test para poder probar la respuesta del servidor que fue creado.

Logros del proyecto (se puede visualizar con Postman):
1. Método GET trayendo toda la data del archivo. URL: http://localhost:300/animes
2. Método GET trayendo la data buscando por ID. URL: http://localhost:300/animes?id=1 (cambiar el 1 por en número requerido)
3. Método GET trayendo la data buscando por nombre. URL: http://localhost:300/animes?nombre=Akira (cambiar en nombre, según lo requerido, busca sin importar si son mayúsculas o minúsculas)
4. Método POST, ingreso de información, obligatoriamente con 4 campos: nombre, genero, año y autor. No acepta la información si no están los 4. Autogenera ID. URL: http://localhost:300/animes Body -> Raw + JSON {"nombre": "nombre", "genero":"genero","año":"año", "autor": "autor"}
5. Método PUT, actualización de información partiendo por el ID. Obligatoriamente tiene que reingresar los 4 campos: nombre, genero, año y autor. URL: http://localhost:300/animes/1 (cambiar el 1 por en número requerido) Body -> Raw + JSON {"nombre": "nuevo nombre", "genero":"nuevo genero","año":"nuevo año", "autor": "nuevo autor"}
6. Método Delete, borra un objeto del array partiendo por el ID. URL: http://localhost:300/animes/1 (cambiar el 1 por en número requerido)
7. 1 Test para probar la respuesta el servidor que fue creado. Iniciar el Servidor en un terminal (node index.js) y en otro correr el test (npx mocha test/server.test.js)
8. 4 Test para probar el ingreso de un animme (con información válida y con información faltante) y buscar un anime por ID (con casos extremos: 1 y 9999). En una terminal escribir npx mocha test/functions.test.js


















4. Método POST, ingresando información:





















5. Método POST, intento de ingreso de data sin toda la información:













6. 






















































