import { ClientOptions, Transport } from '@nestjs/microservices';

export const notificationRMQClientOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RMQ_HOST_URL],
    queue: 'notification',
    noAck: false,
    queueOptions: {
      durable: false,
    },
  },
};
