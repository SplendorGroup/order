import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReserveOrderUseCase } from '@/application/usecases/reserve-order';
import { PayOrderUseCase } from '@/application/usecases/pay-order';
import { CancelOrderUseCase } from '@/application/usecases/cancel-order';
import { CompleteOrderUseCase } from '@/application/usecases/complete-order';
import { ReserveOrderDTO } from '@/application/dtos/reserve-order';
import { PayOrderDTO } from '@/application/dtos/pay-order';
import { CancelOrderDTO } from '@/application/dtos/cancel-order';
import { CompleteOrderDTO } from '@/application/dtos/complete-order';

@Controller()
export class OrderEventsController {
  constructor(
    private readonly reserveOrderUseCase: ReserveOrderUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly completeOrderUseCase: CompleteOrderUseCase,
  ) {}

  @EventPattern('ReserveOrder')
  async handleReserveOrder(@Payload() data: ReserveOrderDTO) {
    await this.reserveOrderUseCase.execute(data);
  }

  @EventPattern('PayOrder')
  async handlePayOrder(@Payload() data: PayOrderDTO) {
    await this.payOrderUseCase.execute(data);
  }

  @EventPattern('CancelOrder')
  async handleCancelOrder(@Payload() data: CancelOrderDTO) {
    await this.cancelOrderUseCase.execute(data);
  }

  @EventPattern('CompleteOrder')
  async handleCompleteOrder(@Payload() data: CompleteOrderDTO) {
    await this.completeOrderUseCase.execute(data);
  }
}
