import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Création d'un nouveau client
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, company, username, firstName, lastName, address, profile } = req.body;
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
    const customers = await prisma.customer.findMany();
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
    res.json(`Customer ${customer.firstName} ${customer.lastName} has been successfully deleted!`);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

  // Récupération des commandes d'un client spécifique
export const getOrdersByCustomerId = async (req: Request, res: Response) => {
  try {
    const customerId = Number(req.params.customerId);
    const orders = []; // await prisma.order.findMany({ where: { customerId } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Récupération d'une commande spécifique d'un client
export const getOrderByIdAndCustomerId = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = []; // await prisma.order.findUnique({ where: { id: orderId } });
    // Vérifier si la commande appartient au client spécifié
    // if (order && order.customerId === Number(req.params.customerId)) {
    //   res.json(order);
    // } else {
    //   res.status(404).json({ error: 'Order not found' });
    // }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Récupération des produits d'une commande spécifique d'un client
export const getProductsByOrderIdAndCustomerId = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const products = []; // await prisma.order.findUnique({ where: { id: orderId } }).product();
    // Vérifier si la commande appartient au client spécifié
    // if (order && order.customerId === Number(req.params.customerId)) {
    //   res.json(products);
    // } else {
    //   res.status(404).json({ error: 'Order not found' });
    // }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
