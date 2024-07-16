import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrderService } from '@/application/services/order';
import { Order } from '@/domain/entities/order';

@Injectable()
export class DeleteOrderUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(id: string): Promise<void> {
    const order = await this.findOrderById(id);
    this.checkIfOrderExists(order);
    await this.deleteOrder(id);
  }

  private async findOrderById(id: string) {
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

  private async deleteOrder(id: string) {
    try {
      await this.orderService.delete(id);
    } catch {
      throw new RpcException({
        code: 2104,
        details: JSON.stringify({
          name: 'Order Deletion Failed',
          identify: 'ORDER_DELETION_FAILED',
          status: 500,
          message: 'Failed to delete order.',
        }),
      });
    }
  }
}
