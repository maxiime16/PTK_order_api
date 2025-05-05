import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectDB } from "./config/mongoose";
import ordersRouter from "./routes/orders.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use("/orders", ordersRouter);

// Server start
const PORT = process.env.PORT || 3002;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Orders API running on port ${PORT}`);
  });
});
