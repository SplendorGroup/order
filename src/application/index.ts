import { Global, Module } from '@nestjs/common';
import { CancelOrderUseCase } from './usecases/cancel-order';
import { CompleteOrderUseCase } from './usecases/complete-order';
import { CreateOrderUseCase } from './usecases/create-order';
import { DeleteOrderUseCase } from './usecases/delete-order';
import { FindAllOrdersUseCase } from './usecases/find-all-order';
import { FindOneOrderUseCase } from './usecases/find-one-order';
import { PayOrderUseCase } from './usecases/pay-order';
import { ReserveOrderUseCase } from './usecases/reserve-order';
import { UpdateOrderUseCase } from './usecases/update-order';
import { OrderService } from './services/order';

@Global()
@Module({
  providers: [
    CancelOrderUseCase,
    CompleteOrderUseCase,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    FindAllOrdersUseCase,
    FindOneOrderUseCase,
    PayOrderUseCase,
    ReserveOrderUseCase,
    UpdateOrderUseCase,
    OrderService
  ],
  exports: [
    CancelOrderUseCase,
    CompleteOrderUseCase,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    FindAllOrdersUseCase,
    FindOneOrderUseCase,
    PayOrderUseCase,
    ReserveOrderUseCase,
    UpdateOrderUseCase,
    OrderService
  ],
})
export class Application {}
