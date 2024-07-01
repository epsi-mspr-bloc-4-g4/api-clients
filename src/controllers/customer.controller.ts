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
    const messages = await consumeMessages("client-orders-fetch");

    const latestOrders = JSON.parse(messages[messages.length - 1].value);

    const customers = await prisma.customer.findMany({
      include: {
        address: true,
        profile: true,
        company: true,
      },
    });

    let customArray: any[] = [];

    customers.forEach((customer) => {
      const customerOrders = latestOrders.filter(
        (order: any) => order.customerId === customer.id
      );
      customArray.push({
        createdAt: customer.createdAt,
        name: customer.name,
        username: customer.username,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: {
          postalCode: customer.address.postalCode,
          city: customer.address.city,
        },
        profile: {
          firstname: customer.firstName,
          lastname: customer.lastName,
        },
        company: {
          companyName: customer.company.name,
        },
        id: customer.id,
        orders: customerOrders.map((order: any) => ({
          id: order.id,
          customerId: order.customerId,
          createdAt: order.createdAt,
        })),
      });
    });

    res.json(customArray);
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

    const latestOrders = JSON.parse(messages[messages.length - 1].value);

    // Filter orders to get those for the specified customer
    const filteredOrders = latestOrders.filter(
      (order: any) => order.customerId === Number(customerId)
    );

    // Group orders by orderId
    const ordersByOrderId = filteredOrders.reduce((acc: any, order: any) => {
      if (!acc[order.orderId]) {
        acc[order.orderId] = {
          customerId: order.customerId,
          id: order.orderId,
          createdAt: order.createdAt,
          products: [],
        };
      }
      acc[order.orderId].products.push({
        id: order.id,
        orderId: order.orderId,
        name: order.name,
        details: order.details,
        stock: order.stock,
      });
      return acc;
    }, {});

    // Convert the grouped orders into an array
    const customerOrders = Object.values(ordersByOrderId);

    res.json(customerOrders);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong " + error });
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
    let foundOrder = null;
    for (const message of messages) {
      const value = JSON.parse(message.value);
      const order = Array.isArray(value)
        ? value.find(
            (order: any) =>
              order.customerId === Number(customerId) &&
              order.orderId === Number(orderId)
          )
        : null;

      const products = value
        .map((product: any) => {
          if (!!order && product.orderId == order.orderId) {
            return {
              id: product.id,
              orderId: product.orderId,
              name: product.name,
              details: product.details,
              stock: product.stock,
            };
          }
        })
        .filter((product: any) => product);

      if (order) {
        foundOrder = {
          id: order.id,
          customerId: order.customerId,
          createdAt: order.createdAt,
          products: products,
        };
        break;
      }
    }

    if (foundOrder) {
      res.json(foundOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error}` });
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

    let foundOrder = null;
    for (const message of messages) {
      const value = JSON.parse(message.value);
      const order = Array.isArray(value)
        ? value.find(
            (order: any) =>
              order.customerId === Number(customerId) &&
              order.orderId === Number(orderId)
          )
        : null;

      if (order) {
        foundOrder = order;
        break;
      }
    }

    if (foundOrder) {
      res.json(foundOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error}` });
    console.log(error);
  }
};
