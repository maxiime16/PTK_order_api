import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectDB } from "./config/mongoose";
import { connectRabbitMQ } from "./lib/rabbitmq";
import ordersRouter from "./routes/orders.routes";
import { consumeCreateOrder } from "./services/orderConsumer";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use("/orders", ordersRouter);

const PORT_ORDER = process.env.PORT_ORDER;

async function startServer() {
  try {
    // On attend la connexion MongoDB et RabbitMQ
    await connectDB();
    await connectRabbitMQ();

    // Démarrer le consumer qui écoute "orders.create"
    await consumeCreateOrder();

    // On démarre ensuite le serveur
    app.listen(PORT_ORDER, () => {
      console.log(`✅ Evertything is OK, Orders API running on port ${PORT_ORDER}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur :", error);
    process.exit(1);
  }
}

startServer();