import './../instrument.js';
import * as Sentry from "@sentry/node";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import customerRouter from "./routes/customer.routes";
import { errorHandler } from "./middlewares/errorHandler"; 

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use(errorHandler);
Sentry.setupExpressErrorHandler(app);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use("/", customerRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

export default app;
