import request from 'supertest';
import app from '../src/app'; // Assurez-vous que le chemin vers app.ts est correct
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('GET /api/customers/:id', () => {
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
  
  it('should get a customer by ID', async () => {
    // Ajouter un client à la base de données pour les tests
    const newCustomer = await prisma.customer.create({
      data: {
        createdAt: new Date(), 
        name: "John Doe",
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        address: {
          create: {
            postalCode: "12345",
            city: "Test City"
          }
        },
        profile: {
          create: {
            firstName: "John",
            lastName: "Doe"
          }
        },
        company: {
          create: {
            name: "Test Company"
          }
        }
      }
    });

    const response = await request(app).get(`/api/customers/${newCustomer.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'John Doe');
    expect(response.body).toHaveProperty('username', 'johndoe');
    expect(response.body).toHaveProperty('firstName', 'John');
    expect(response.body).toHaveProperty('lastName', 'Doe');
    expect(response.body).toHaveProperty('address');
    expect(response.body.address).toHaveProperty('postalCode', '12345');
    expect(response.body.address).toHaveProperty('city', 'Test City');
    expect(response.body).toHaveProperty('profile');
    expect(response.body.profile).toHaveProperty('firstName', 'John');
    expect(response.body.profile).toHaveProperty('lastName', 'Doe');
    expect(response.body).toHaveProperty('company');
    expect(response.body.company).toHaveProperty('name', 'Test Company');

    // Nettoyer les données de test de la base de données
    await prisma.customer.delete({ where: { id: newCustomer.id } });
  });
});
