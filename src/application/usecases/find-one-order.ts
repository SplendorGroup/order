import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrderService } from '@/application/services/order';
import { Order } from '@/domain/entities/order';
import { OrderMapper } from '@/domain/mappers/order';

@Injectable()
export class FindOneOrderUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(id: string) {
    const order = await this.findOrderById(id);
    this.checkIfOrderExists(order);
    return this.transformResponse(order);
  }

  private async findOrderById(id: string): Promise<Order> {
    return await this.orderService.findById(id) as Order;
  }

  private checkIfOrderExists(order: Order | null) {
    if (!order) {
      throw new RpcException({
        code: 2100,
        details: JSON.stringify({
          name: 'Order Not Found',
          identify: 'ORDER_NOT_FOUND',
          status: 404,
          message: 'The specified order could not be found.',
        }),
      });
    }
  }

  private transformResponse(order: Order) {
    return OrderMapper.toResponse(order);
  }
}
