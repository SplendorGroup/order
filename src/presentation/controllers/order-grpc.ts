import { Controller, Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateOrderUseCase } from '@/application/usecases/create-order';
import { UpdateOrderUseCase } from '@/application/usecases/update-order';
import { FindAllOrdersUseCase } from '@/application/usecases/find-all-order';
import { FindOneOrderUseCase } from '@/application/usecases/find-one-order';
import { DeleteOrderUseCase } from '@/application/usecases/delete-order';
import { CreateOrderDTO } from '@/application/dtos/create-order';
import { UpdateOrderDTO } from '@/application/dtos/update-order';
import { FindAllOrderDTO } from '@/application/dtos/find-all-order';
import { FindOneOrderDTO } from '@/application/dtos/find-one-order';
import { DeleteOrderDTO } from '@/application/dtos/delete-order';
import { ValidateGrpcInput } from '@/infraestructure/decorators/validate-grpc-input';

@Controller()
export class OrderGRPCController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly findOneOrderUseCase: FindOneOrderUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
  ) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  @ValidateGrpcInput(
    { body: CreateOrderDTO },
    {
      code: 2105,
      identify: 'ORDER_UNPROCESSABLE_CONTENT',
    },
  )
  async createOrder(data: { body: CreateOrderDTO, user: any }) {
    return await this.createOrderUseCase.execute({
      ...data.body,
      user_id: data?.user?.id
    });
  }

  @GrpcMethod('OrderService', 'UpdateOrder')
  @ValidateGrpcInput(
    { params: { id: String }, body: UpdateOrderDTO },
    {
      code: 2105,
      identify: 'ORDER_UNPROCESSABLE_CONTENT',
    },
  )
  async updateOrder(data: { params: { id: string }, body: UpdateOrderDTO, user: any }) {
    return await this.updateOrderUseCase.execute(data.params.id,{
      ...data.body,
      user_id: data?.user?.id
    });
  }

  @GrpcMethod('OrderService', 'GetOrders')
  @ValidateGrpcInput(
    { query: FindAllOrderDTO },
    {
      code: 2105,
      identify: 'ORDER_UNPROCESSABLE_CONTENT',
    },
  )
  async getOrders(data: { query: FindAllOrderDTO, user: any }) {
    return await this.findAllOrdersUseCase.execute(data.query);
  }

  @GrpcMethod('OrderService', 'GetOrderById')
  @ValidateGrpcInput(
    { params: FindOneOrderDTO },
    {
      code: 2105,
      identify: 'ORDER_UNPROCESSABLE_CONTENT',
    },
  )
  async getOrderById(data: { params: FindOneOrderDTO, user: any }) {
    return await this.findOneOrderUseCase.execute(data.params.id);
  }

  @GrpcMethod('OrderService', 'DeleteOrder')
  @ValidateGrpcInput(
    { params: DeleteOrderDTO },
    {
      code: 2105,
      identify: 'ORDER_UNPROCESSABLE_CONTENT',
    },
  )
  async deleteOrder(data: { params: DeleteOrderDTO, user: any }) {
    return await this.deleteOrderUseCase.execute(data.params.id);
  }
}
