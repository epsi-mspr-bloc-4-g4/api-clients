import request from 'supertest';
import app from '../src/app'; // Assurez-vous que le chemin vers app.ts est correct

describe('GET /api/customers', () => {
  let server: any;

  beforeAll((done) => {
    server = app.listen(7000, () => {
      console.log('Test server is running on port 7000');
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });
  it('should get all customers', async () => {
    const response = await request(app).get('/api/customers');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0); // Vérifier qu'au moins un client est retourné
    expect(response.body[0]).toHaveProperty('name'); // Vérifier que les propriétés existent
    expect(response.body[0]).toHaveProperty('username');
    expect(response.body[0]).toHaveProperty('firstName');
    expect(response.body[0]).toHaveProperty('lastName');
    expect(response.body[0]).toHaveProperty('address');
    expect(response.body[0]).toHaveProperty('profile');
    expect(response.body[0]).toHaveProperty('company');
  });
});
