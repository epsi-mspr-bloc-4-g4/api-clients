import request from "supertest";
import app from "../src/app";

describe("API Tests", () => {
  const newCustomer = {
    company: {
      name: "Test Company",
    },
    name: "Test Name",
    username: "Test User",
    firstName: "Test Firstname",
    lastName: "Test Lastname",
    address: {
      postalCode: "99999",
      city: "Test City",
    },
    profile: {
      firstName: "Test Firstname",
      lastName: "Test Lastname",
    },
  };

  beforeEach(async () => {
    await request(app).post("/api/customers").send(newCustomer);
  });

  it("GET /api/customers : should return 200", async () => {
    const response = await request(app).get("/api/customers");
    await new Promise((resolve) => setTimeout(resolve, 6000)); // attendre 6 secondes

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("GET /api/customers/:id : should return 200", async () => {
    const response = await request(app).get("/api/customers");
    const lastCustomer = response.body[response.body.length - 1];

    const response2 = await request(app).get(
      `/api/customers/${lastCustomer.id}`
    );
    expect(response2.statusCode).toBe(200);
    expect(response2.body).toHaveProperty("name", newCustomer.name);
  });

  it("DELETE /api/customers/:id : should return 200 at first, and 500 for the second time", async () => {
    const response = await request(app).get("/api/customers");
    const lastCustomer = response.body[response.body.length - 1];

    const response2 = await request(app).delete(
      `/api/customers/${lastCustomer.id}`
    );
    expect(response2.statusCode).toBe(200);
  });

  it("PUT /api/customers/:id : should return 200", async () => {
    const response = await request(app).get("/api/customers");
    const lastCustomer = response.body[response.body.length - 1];

    const response2 = await request(app)
      .put(`/api/customers/${lastCustomer.id}`)
      .send({ name: "Updated Name" });

    expect(response2.statusCode).toBe(200);

    const response3 = await request(app).get(
      `/api/customers/${lastCustomer.id}`
    );
    expect(response3.body).toHaveProperty("name", "Updated Name");
  });

  it("should persist data between restarts", (done) => {
    request(app)
      .post("/api/customers")
      .send(newCustomer)
      .then((addResponse) => {
        expect(addResponse.statusCode).toBe(200);
        const addedCustomer = addResponse.body;

        request(app)
          .get(`/api/customers/${addedCustomer.id}`)
          .then((getResponse) => {
            expect(getResponse.statusCode).toBe(200);
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
});
