import { Global, Module } from '@nestjs/common';
import { OrderEventsController } from './controllers/order-events';
import { OrderGRPCController } from './controllers/order-grpc';

@Global()
@Module({
  controllers: [
    OrderEventsController,
    OrderGRPCController
  ],
})
export class Presentation {}
