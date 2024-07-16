import { Inject, Injectable } from '@nestjs/common';
import { Order } from '@/domain/entities/order';
import { IRepository } from '@/domain/interfaces/irepository';

@Injectable()
export class OrderService {
  @Inject('order')
  public readonly order: IRepository<'order'>;

  async findAll(order?: Partial<Order>): Promise<Partial<Order>[]> {
    return await this.order.findAll(order);
  }

  async findById(id: string): Promise<Partial<Order>> {
    return await this.order.findById(id);
  }

  async findOne(order: Partial<Order>): Promise<Partial<Order>> {
    return await this.order.findOne(order);
  }

  async create(order: Partial<Order>): Promise<Partial<Order>> {
    return await this.order.create(order);
  }

  async update(id: string, order: Partial<Order>): Promise<Partial<Order>> {
    return (await this.order.update(id, order)) as unknown as Partial<Order>;
  }

  async delete(id: string): Promise<void> {
    return await this.order.deleteById(id);
  }

  async count(order: Partial<Order>): Promise<number> {
    return await this.order.count(order);
  }
}
