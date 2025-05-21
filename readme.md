## Créer les .env:

### 1/ .env
```
MONGODB_ORDER_URI=mongodb://mspr:mspr@localhost:27017/orders_db?authSource=admin
RabbitMQ_URI=amqp://mspr:mspr@localhost:5672
PORT_CLIENT=3002
JWT_SECRET=mySuperSecretForMSPR
```

### 2/ .env.docker
```
MONGODB_ORDER_URI=mongodb://mspr:mspr@payetonkawa-mongo:27017/orders_db?authSource=admin
RabbitMQ_URI=amqp://mspr:mspr@payetonkawa-rabbitmq:5672
PORT_CLIENT=3002
JWT_SECRET=mySuperSecretForMSPR
```
