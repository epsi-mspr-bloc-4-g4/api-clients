import request from "supertest";

const baseURL = "http://localhost:7000";

describe("GET /api/customers", () => {
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
  beforeAll(async () => {
    await request(baseURL).post("/api/customers").send(newCustomer);
  });

  it("GET /api/customers : should return 200", async () => {
    const response = await request(baseURL).get("/api/customers");
    expect(response.statusCode).toBe(200);
  });

  it("GET /api/customers/:id : should return 200", async () => {
    const response = await request(baseURL).get("/api/customers");
    const lastCustomer = response.body[response.body.length - 1];
    const id = Math.floor(Math.random() * lastCustomer.id + 1);

    const response2 = await request(baseURL).get(`/api/customers/${id}`);
    expect(response2.statusCode).toBe(200);
  });

  it("DELETE /api/customers/:id : should return 200 at first, and 500 for the second time", async () => {
    const response = await request(baseURL).get("/api/customers");
    const lastCustomer = response.body[response.body.length - 1];

    const response2 = await request(baseURL).delete(
      `/api/customers/${lastCustomer.id}`
    );
    expect(response2.statusCode).toBe(200);

    const response3 = await request(baseURL).delete(
      `/api/customers/${lastCustomer.id}`
    );
    expect(response3.statusCode).toBe(500);
  });

  it("PUT /api/customers/:id : should return 200", async () => {
    const response = await request(baseURL).get("/api/customers");
    const lastCustomer = response.body[response.body.length - 1];

    const response2 = await request(baseURL)
      .put(`/api/customers/${lastCustomer.id}`)
      .send({ name: "Updated Name" });

    expect(response2.statusCode).toBe(200);
  });
});
