import express from "express";
import * as customerController from "../controllers/customer.controller";

const customerRouter = express.Router();

// Customer routes
customerRouter.post("/api/customers", customerController.createCustomer);
customerRouter.get("/api/customers", customerController.getAllCustomers);
customerRouter.get("/api/customers/:id", customerController.getCustomerById);
customerRouter.put("/api/customers/:id", customerController.updateCustomer);
customerRouter.delete("/api/customers/:id", customerController.deleteCustomer);

// Customer orders routes
customerRouter.get('/api/customers/:customerId/orders', customerController.getOrdersByCustomerId);
// ustomerRouter.post('/api/customers/:customerId/orders', customerController.createClientOrder);

// Customer order routes by id
customerRouter.get('/api/customers/:customerId/orders/:orderId', customerController.getOrderByIdAndCustomerId);
//customerRouter.put('/api/customers/:customerId/orders/:orderId', customerController.updateClientOrder);
//customerRouter.delete('/api/customers/:customerId/orders/:orderId', customerController.deleteClientOrder);

// Customer order products routes
customerRouter.get('/api/customers/:customerId/orders/:orderId/products', customerController.getProductsByOrderIdAndCustomerId);
//customerRouter.put('/api/customers/:customerId/orders/:orderId/products', customerController.updateClientOrder);
// customerRouter.delete('/api/customers/:customerId/orders/:orderId/products', customerController.deleteClientOrder);

export default customerRouter;
