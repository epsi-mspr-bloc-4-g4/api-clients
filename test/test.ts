import request from "supertest";
import express from "express";
import { PrismaClient } from "@prisma/client";

import app from "../src/app";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    customer: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

// Arrange
const mockCustomer = {
  id: 4,
  name: "John Doe",
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  address: {
    postalCode: "12345",
    city: "New York",
  },
  profile: {
    firstName: "John",
    lastName: "Doe",
  },
  company: {
    name: "Coca-cola",
  },
};

describe("POST /api/customers", () => {
  it("should create a new customer and return it", async () => {
    (prisma.customer.create as jest.Mock).mockResolvedValue(mockCustomer);

    // Act
    const response = await request(app)
      .post("/api/customers")
      .send(mockCustomer);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCustomer);
  });
});

describe("POST /api/customers", () => {
  it("should return a different customer", async () => {
    const newCustomerData = {
      company: {
        name: "Coca-cola",
      },
      name: "Michel",
      username: "Delarue",
      firstName: "Alfred",
      lastName: "ola",
      address: {
        postalCode: "33000",
        city: "Bordeaux",
      },
      profile: {
        firstName: "Jean",
        lastName: "Claude",
      },
    };
    (prisma.customer.create as jest.Mock).mockResolvedValue(newCustomerData);

    // Act
    const response = await request(app)
      .post("/api/customers")
      .send(newCustomerData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).not.toEqual(mockCustomer);
  });
});

describe("GET /api/customers", () => {
  it("should return all customers", async () => {
    (prisma.customer.findMany as jest.Mock).mockResolvedValue([
      mockCustomer,
      mockCustomer,
      mockCustomer,
    ]);

    const response = await request(app).get("/api/customers");

    console.log("response :: ", response.status);
    expect(response.status).toBe(200);
    // expect(response.body).toBeDefined();
    // expect(Array.isArray(response.body)).toBe(true);
  });
});

// describe("GET /api/customers/:id", () => {
//   it("should return a single customer by ID", async () => {
//     const response = await request(app).get("/api/customers/1");
//     expect(response.status).toBe(200);
//     expect(response.body).toBeDefined();
//     expect(response.body.id).toBe(1);
//   });

//   it("should return 404 if customer not found", async () => {
//     const response = await request(app).get("/api/customers/999");
//     expect(response.status).toBe(404);
//   });
// });

// describe("PUT /api/customers/:id", () => {
//   it("should update a customer", async () => {
//     const response = await request(app)
//       .put("/api/customers/1")
//       .send({ name: "Updated Name" });

//     expect(response.status).toBe(200);
//     expect(response.body).toBeDefined();
//     expect(response.body.name).toBe("Updated Name");
//   });
// });

// describe("DELETE /api/customers/:id", () => {
//   it("should delete a customer", async () => {
//     const response = await request(app).delete("/api/customers/1");
//     expect(response.status).toBe(200);
//     expect(response.body).toBeDefined();
//     expect(response.body).toContain("successfully deleted");
//   });
// });
