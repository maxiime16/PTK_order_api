import { getChannel } from '../lib/rabbitmq.js';
import jwt from 'jsonwebtoken';

/**
 * Publie un message "order.created" avec un JWT signé
 * pour sécuriser la communication inter-service.
 */
export async function publishOrderCreated(newOrder: any) {
  const channel = getChannel();
  const exchange = 'orders';
  const routingKey = 'order.created';

  // On s'assure que l'exchange existe
  await channel.assertExchange(exchange, 'topic', { durable: true });

  // Génération du JWT
  const token = jwt.sign(
    { service: 'orders-api' }, // contenu du token
    process.env.SERVICE_SECRET as string, // clé secrète partagée
    { expiresIn: '5m' }, // token valide 5 minutes
  );

  // Construction du message sécurisé
  const message = {
    event: routingKey,
    data: newOrder,
    token,
  };

  // Publication du message
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });

  console.log(`🚀 Published "${routingKey}" for orderId=${newOrder._id}`);
}
