import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrderService } from '@/application/services/order';
import { OrderMapper } from '@/domain/mappers/order';
import { OrderStatus } from '@/domain/enums/order-status';
import { Order } from '@/domain/entities/order';
import { PayOrderDTO } from '../dtos/pay-order';
import { NotificationProvider } from '@/infraestructure/providers/notification';

@Injectable()
export class PayOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    @Inject("NOTIFICATION")
    private readonly notificationProvider: NotificationProvider,
  ) {}

  async execute({ id }: PayOrderDTO): Promise<any> {
    const order = await this.findOrderById(id);
    this.checkIfOrderExists(order);
    order.status = OrderStatus.PAID;
    const updatedOrder = await this.updateOrder(order);
    return this.transformResponse(updatedOrder);
  }

  private async findOrderById(id: string) {
    return await this.orderService.findById(id);
  }

  private checkIfOrderExists(order: Partial<Order> | null) {
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

  private async updateOrder(order: Partial<Order>): Promise<Order> {
    try {
      return await this.orderService.update(order.id, order) as Order;
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

  private async sendNotification(order: Order) {
    await this.notificationProvider.sendMailSingle({
      user_id: order.user_id,
      name: 'Order Reserved',
      to: 'user@example.com', 
      subject: 'Your order has been reserved',
      text: `Your order for vehicle ${order.vehicle_id} has been reserved.`,
    });

    await this.notificationProvider.sendPush({
      user_id: order.user_id,
      token: 'user_push_token', 
      title: 'Order Reserved',
      body: `Your order for vehicle ${order.vehicle_id} has been reserved.`,
      type: 'order_reserved',
      priority: 'high',
    });
  }

  private transformResponse(order: Order) {
    return OrderMapper.toResponse(order);
  }
}
