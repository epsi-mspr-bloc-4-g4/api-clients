// routes/customerRouter.js

import express from "express";
import * as customerController from "../controllers/customer.controller";

const customerRouter = express.Router();

customerRouter.post("/api/customers", customerController.createCustomer);
customerRouter.get("/api/customers", customerController.getAllCustomers);
customerRouter.get("/api/customers/:id", customerController.getCustomerById);
customerRouter.put("/api/customers/:id", customerController.updateCustomer);
customerRouter.delete("/api/customers/:id", customerController.deleteCustomer);

export default customerRouter;
