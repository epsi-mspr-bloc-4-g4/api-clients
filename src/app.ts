import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import helmet from "helmet";
import customerRouter from "./routes/customer.routes";
import { errorHandler } from "./middlewares/errorHandler"; 

dotenv.config();

const PORT = process.env.PORT || 3000;

Sentry.init({
  dsn: "https://23a486814f480b9ff425587db31ff137@o4507378463080448.ingest.de.sentry.io/4507486532272208",
  integrations: [
      nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

Sentry.setupExpressErrorHandler(app);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use("/", customerRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Bad request' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

export default app;
