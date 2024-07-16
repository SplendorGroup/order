import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrderService } from '@/application/services/order';
import { UpdateOrderDTO } from '@/application/dtos/update-order';
import { OrderMapper } from '@/domain/mappers/order';
import { Order } from '@/domain/entities/order';

@Injectable()
export class UpdateOrderUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(id: string, data: UpdateOrderDTO) {
    const existingOrder = await this.findOrderById(id);
    this.checkIfOrderExists(existingOrder);
    const updatedOrder = await this.updateOrder(id, data);
    return this.transformResponse(updatedOrder);
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

  private async updateOrder(id: string, data: UpdateOrderDTO): Promise<Order> {
    try {
      return await this.orderService.update(id, data) as Order;
    } catch {
      throw new RpcException({
        code: 2103,
        details: JSON.stringify({
          name: 'Order Update Failed',
          identify: 'ORDER_UPDATE_FAILED',
          status: 500,
          message: 'Failed to update order.',
        }),
      });
    }
  }

  private transformResponse(order: Order) {
    return OrderMapper.toResponse(order);
  }
}
