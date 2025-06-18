import { getChannel } from '../lib/rabbitmq.js';
import { createNewOrder } from './orders.service.js';
import { publishOrderCreated } from './orderPublisher.js';

/**
 * Consomme la queue "orders.create" pour créer une commande en base
 * et publier un événement "order.created".
 */
export async function consumeCreateOrder() {
  const channel = getChannel();
  const queueName = 'orders.create';

  // Assure la création de la queue
  await channel.assertQueue(queueName, { durable: true });

  // Se met en écoute des messages
  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());
      console.log('📥 [orders-api] Received "orders.create":', content);

      // 1) Créer la commande dans la base
      const newOrder = await createNewOrder(content);

      // 2) Publier un événement "order.created"
      await publishOrderCreated(newOrder);

      // Accuse réception
      channel.ack(msg);
    } catch (error) {
      console.error('❌ Error processing "orders.create":', error);
      // Possibilité de rejeter et passer en Dead Letter
      channel.nack(msg, false, false);
    }
  });
}
