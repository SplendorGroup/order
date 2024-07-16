import { Injectable } from '@nestjs/common';
import { Order } from "../entities/order";
import { OrderMapper } from "../mappers/order";

@Injectable()
export class OrderFactory {
  create(data: any): any {
    const orderDomain = OrderMapper.toDomain(data);
    const order = new Order(orderDomain);
    return OrderMapper.toPersistence(order);
  }
}
