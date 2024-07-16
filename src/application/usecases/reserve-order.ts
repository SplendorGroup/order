import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrderService } from '@/application/services/order';
import { OrderMapper } from '@/domain/mappers/order';
import { OrderStatus } from '@/domain/enums/order-status';
import { ReserveOrderDTO } from '@/application/dtos/reserve-order';
import { Order } from '@/domain/entities/order';
import { NotificationProvider } from '@/infraestructure/providers/notification';
import { IUserProvider } from '@/domain/interfaces/iuser';
import { FindOneResponse } from '@/infraestructure/clients/types/user';

@Injectable()
export class ReserveOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    @Inject("NOTIFICATION")
    private readonly notificationProvider: NotificationProvider,
    @Inject("USER")
    private readonly userProvider: IUserProvider
  ) {}

  async execute({ id }: ReserveOrderDTO): Promise<any> {
    const order = await this.findOrderById(id);
    this.checkIfOrderExists(order);
    const user = await this.findUser(order.user_id)
    this.checkIfUserFound(user)
    order.status = OrderStatus.RESERVED;
    const updatedOrder = await this.updateOrder(order);
    await this.sendNotification(order);
    return this.transformResponse(updatedOrder);
  }

  private async findOrderById(id: string) {
    return await this.orderService.findById(id) as Order;
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

  private async findUser(user_id: string) {
    return await this.userProvider.proxyUser('FindOne', { params: { id: user_id } }) as FindOneResponse
  }

  checkIfUserFound(user: Partial<FindOneResponse> | null) {
    if (!user) {
      throw new RpcException({
        code: 1200,
        details: JSON.stringify({
          name: 'User Not Found',
          identify: 'USER_NOT_FOUND',
          status: 404,
          message: 'The specified user could not be found.',
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
        
