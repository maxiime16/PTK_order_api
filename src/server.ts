import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import router from './routes/orders.routes.js';
import { register } from './config/metrics.js';
import { connectDB } from './config/mongoose.js';
import { connectRabbitMQ } from './lib/rabbitmq.js';
import { requestLogger } from './lib/loggerMiddleware.js';
import { metricsMiddleware } from './lib/metricsMiddleware.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(requestLogger);
app.use(metricsMiddleware);

// Routes
app.use('/orders', router);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT_ORDER = process.env.PORT_ORDER;

async function startServer() {
  try {
    // On attend la connexion MongoDB et RabbitMQ
    await connectDB();
    await connectRabbitMQ();

    // Démarrer le consumer qui écoute

    // On démarre ensuite le serveur
    app.listen(PORT_ORDER, () => {
      console.log(`✅ Evertything is OK, Orders API running on port ${PORT_ORDER}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur :', error);
    process.exit(1);
  }
}

startServer();
