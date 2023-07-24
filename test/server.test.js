const chai = require('chai');
const http = require('http');

const { expect } = chai;

describe('Servidor', () => {
    it('debería responder a las solicitudes GET con código 200 y tipo de contenido JSON', (done) => {
        const server = require('../index'); // Asegúrate de ajustar la ruta al archivo index.js según la ubicación de tu test

        // Realizamos la solicitud HTTP al servidor
        http.get('http://localhost:3000/animes', (res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json');

            // Importante llamar a done() para indicar que el test ha terminado
            done();
        });
    });
});