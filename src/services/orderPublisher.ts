import { getChannel } from "../lib/rabbitmq";

/**
 * Publie un message "order.created" dans RabbitMQ
 * pour informer les autres micro-services qu'une commande est créée.
 */
export async function publishOrderCreated(newOrder: any) {
  const channel = getChannel();
  const queueName = "order.created";

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(
    queueName,
    Buffer.from(
      JSON.stringify({
        event: "order.created",
        data: newOrder,
      })
    )
  );

  console.log(`🚀 Published "order.created" for orderId=${newOrder._id}`);
}
