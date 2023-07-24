const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); // Import the server created in index.js
const expect = chai.expect;

chai.use(chaiHttp);

describe('Anime CRUD', () => {

    // Test for addAnime() function
    describe('addAnime()', () => {
        it('Should add a new anime with valid data', (done) => {
            // Prepare the new anime data to be added
            const newAnime = {
                nombre: 'Example Anime',
                genero: 'Action',
                año: 2023,
                autor: 'Example Author'
            };

            // Make a POST request to the server to add the new anime
            chai.request(server)
                .post('/animes')
                .send(newAnime)
                .end((err, res) => {
                    // Expect the response status to be 201 Created
                    expect(res).to.have.status(201);

                    // Expect the response body to contain an 'id' property
                    expect(res.body).to.have.property('id');

                    // Mark this test case as complete (done)
                    done();
                });
        });

        it('Should return an error when trying to add an anime with missing required fields', (done) => {
            // Prepare the new anime data with missing 'nombre' and 'autor' fields
            const invalidAnime = {
                genero: 'Action',
                año: 2023,
                // Missing 'nombre' and 'autor' fields
            };

            // Make a POST request to the server to add the invalid anime
            chai.request(server)
                .post('/animes')
                .send(invalidAnime)
                .end((err, res) => {
                    // Expect the response status to be 400 Bad Request
                    expect(res).to.have.status(400);

                    // Expect the response body to contain an 'error' property
                    expect(res.body).to.have.property('error');

                    // Mark this test case as complete (done)
                    done();
                });
        });
    });

    // Test for findAnimeById() function
    describe('findAnimeById()', () => {
        it('Should return an existing anime when providing a valid ID', (done) => {
            // Assume there is an anime with ID equal to '1'
            const existingId = '1';

            // Make a GET request to the server to find the anime by ID
            chai.request(server)
                .get(`/animes?id=${existingId}`)
                .end((err, res) => {
                    // Expect the response status to be 200 OK
                    expect(res).to.have.status(200);

                    // Expect the response body to be an object (representing the found anime)
                    expect(res.body).to.be.an('object');

                    // Mark this test case as complete (done)
                    done();
                });
        });

        it('Should return an error when providing an invalid ID', (done) => {
            // Assume there is no anime with ID equal to '9999'
            const invalidId = '9999';

            // Make a GET request to the server with an invalid ID
            chai.request(server)
                .get(`/animes?id=${invalidId}`)
                .end((err, res) => {
                    // Expect the response status to be 404 Not Found
                    expect(res).to.have.status(404);

                    // Expect the response body to contain an 'error' property
                    expect(res.body).to.have.property('error');

                    // Mark this test case as complete (done)
                    done();
                });
        });
    });

    // Close the server created in index.js
    after(() => {
        server.close();
    });
});