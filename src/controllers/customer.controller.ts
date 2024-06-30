import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { consumeMessages } from "../../kafka/consumer";

const prisma = new PrismaClient();

// Création d'un nouveau client
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, company, username, firstName, lastName, address, profile } =
      req.body;
    const newCustomer = await prisma.customer.create({
      data: {
        createdAt: new Date(),
        company: {
          create: {
            name: company.name,
          },
        },
        name,
        username,
        firstName,
        lastName,
        address: {
          create: {
            postalCode: address.postalCode,
            city: address.city,
          },
        },
        profile: {
          create: {
            firstName: profile.firstName,
            lastName: profile.lastName,
          },
        },
      },
    });
    res.json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

// Récupération de tous les clients
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        address: true,
        profile: true,
        company: true,
      },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Récupération d'un seul client
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        name: true,
        username: true,
        firstName: true,
        lastName: true,
        address: true,
        profile: true,
        company: true,
      },
    });
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Mise à jour d'un client
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Suppression d'un client
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(
      `Customer ${customer.firstName} ${customer.lastName} has been successfully deleted!`
    );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getOrdersByCustomerId = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const messages = await consumeMessages("client-orders-fetch");

    console.log("messages :: ", messages);

    // Process messages to get orders for the customer
    const orders = messages.filter(
      (message) => JSON.parse(message.value).customerId === customerId
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

export const getOrderByIdAndCustomerId = async (
  req: Request,
  res: Response
) => {
  try {
    const { customerId, orderId } = req.params;
    const messages = await consumeMessages("client-orders-fetch");

    // Process messages to get the specific order for the customer
    const order = messages.find((message) => {
      const value = JSON.parse(message.value);
      return value.customerId === customerId && value.orderId === orderId;
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

export const getProductsByOrderIdAndCustomerId = async (
  req: Request,
  res: Response
) => {
  try {
    const { customerId, orderId } = req.params;
    const messages = await consumeMessages("client-orders-fetch");

    // Process messages to get products for the specific order and customer
    const order = messages.find((message) => {
      const value = JSON.parse(message.value);
      return value.customerId === customerId && value.orderId === orderId;
    });

    if (order) {
      res.json(JSON.parse(order.value).products);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};
