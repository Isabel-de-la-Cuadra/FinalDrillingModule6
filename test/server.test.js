const chai = require('chai');
const http = require('http');

const { expect } = chai;

describe('Server', () => {
    it('should respond to GET requests with status code 200 and JSON content type', (done) => {
        // Make an HTTP GET request to the server (assumes the server is already running)
        http.get('http://localhost:3000/animes', (res) => {
            // Expect the response status code to be 200
            expect(res.statusCode).to.equal(200);

            // Expect the 'content-type' header to be 'application/json'
            expect(res.headers['content-type']).to.equal('application/json');

            // Important: Call done() to indicate that the test has finished
            done();
        });
    });
});