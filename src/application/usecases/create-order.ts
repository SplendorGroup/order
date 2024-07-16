import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrderService } from '@/application/services/order';
import { OrderFactory } from '@/domain/factories/order';
import { CreateOrderDTO } from '@/application/dtos/create-order';
import { Order } from '@/domain/entities/order';
import { OrderMapper } from '@/domain/mappers/order';
import { IUserProvider } from '@/domain/interfaces/iuser';
import { FindOneResponse } from '@/infraestructure/clients/types/user';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderFactory: OrderFactory,
    @Inject("USER")
    private readonly userProvider: IUserProvider
  ) {}

  async execute(data: CreateOrderDTO) {
    const order = this.createOrderDomain(data);
    const user = await this.findUser(order.user_id)
    this.checkIfUserFound(user)
    const createdOrder = await this.saveOrder(order);
    return this.transformResponse(createdOrder);
  }

  private createOrderDomain(data: CreateOrderDTO): Order {
    return this.orderFactory.create(data);
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

  private async saveOrder(order: Partial<Order>): Promise<Order> {
    try {
      return await this.orderService.create(order) as Order;
    } catch {
      throw new RpcException({
        code: 2102,
        details: JSON.stringify({
          name: 'Order Creation Failed',
          identify: 'ORDER_CREATION_FAILED',
          status: 500,
          message: 'Failed to create order.',
        }),
      });
    }
  }

  private transformResponse(order: Order) {
    return OrderMapper.toResponse(order);
  }
}
