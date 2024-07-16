import { Global, Module } from '@nestjs/common';
import { OrderFactory } from './factories/order';

@Global()
@Module({
  providers: [
    OrderFactory
  ],
  exports: [
    OrderFactory
  ],
})
export class Domain {}
