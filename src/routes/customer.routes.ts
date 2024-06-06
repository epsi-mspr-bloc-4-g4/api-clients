import express from "express";
import * as customerController from "../controllers/customer.controller";

const customerRouter = express.Router();

customerRouter.post("/api/customers", customerController.createCustomer);
customerRouter.get("/api/customers", customerController.getAllCustomers);
customerRouter.get("/api/customers/:id", customerController.getCustomerById);
customerRouter.put("/api/customers/:id", customerController.updateCustomer);
customerRouter.delete("/api/customers/:id", customerController.deleteCustomer);

// A IMPLEMENTER
/*
customerRouter.get("/api/customers/:customerId/orders", customerController.getOrdersByCustomerId);
customerRouter.get("/api/customers/:customerId/orders/:orderId", customerController.getOrderByIdAndCustomerId);
customerRouter.get("/api/customers/:customerId/orders/:orderId/products", customerController.getProductsByOrderIdAndCustomerId);
*/

export default customerRouter;
