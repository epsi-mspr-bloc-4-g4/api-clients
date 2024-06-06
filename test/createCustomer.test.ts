// tests/createCustomer.test.ts

import request from 'supertest';
import app from '../src/app'; // Assurez-vous d'importer correctement votre application Express

describe('POST /api/customers', () => {
  it('should create a new customer', async () => {
    const response = await request(app)
      .post('/api/customers')
      .send({
        name: 'Test Company',
        company: {
          name: 'Test Company'
        },
        username: 'test_user',
        firstName: 'John',
        lastName: 'Doe',
        address: {
          postalCode: '12345',
          city: 'Test City'
        },
        profile: {
          firstName: 'John',
          lastName: 'Doe'
        }
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    // Vous pouvez ajouter d'autres assertions selon les données que vous attendez
  });

  it('should return an error if data is invalid', async () => {
    const response = await request(app)
      .post('/api/customers')
      .send({
        // Envoyer des données invalides ici
      });

    expect(response.status).toBe(500); // Ou tout autre code d'erreur que vous attendez
    // Vous pouvez ajouter d'autres assertions selon les erreurs que vous attendez
  });
});
