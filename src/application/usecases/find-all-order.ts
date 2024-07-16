import { Injectable } from '@nestjs/common';
import { OrderService } from '@/application/services/order';
import { Order } from '@/domain/entities/order';
import { OrderMapper } from '@/domain/mappers/order';
import { FindAllOrderDTO } from '@/application/dtos/find-all-order';

type Data = {
  id?: string;
  vehicle_id?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
};

type Pagination = {
  skip: number;
  take: number;
};

@Injectable()
export class FindAllOrdersUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(filter: FindAllOrderDTO) {
    const per_page = this.limitPerPage();
    const pagination = this.pagination(filter, per_page);
    const filter_payload = this.mountFilter(filter, pagination);

    const total = await this.countAllOrders(filter);
    const page = this.getPage(pagination);
    const orders = await this.selectWithFilterOrders(filter_payload);
    const in_page = this.countOrdersFiltered(orders);
    const pages = this.countPages(total, per_page);

    return this.findAllOrdersToResponse({
      total,
      page,
      pages,
      per_page,
      in_page,
      data: orders,
    });
  }

  protected pagination(filter: Omit<Data, 'order'>, limit: number) {
    if (!filter?.page || filter?.page <= 1) {
      return {
        skip: 1,
        take: limit,
      };
    }
    return {
      skip: filter?.page + 1,
      take: limit,
    };
  }

  limitPerPage() {
    const page_limit = Number(process.env.PAGE_LIMIT);
    return !isNaN(page_limit) ? page_limit : 10;
  }

  getPage(pagination: ReturnType<FindAllOrdersUseCase['pagination']>) {
    return pagination.skip;
  }

  mountFilter(
    filter: Omit<Data, 'order'>,
    pagination: ReturnType<FindAllOrdersUseCase['pagination']>,
  ) {
    delete filter.page;
    return {
      ...filter,
      ...pagination,
    };
  }

  async selectWithFilterOrders(filter: Omit<Data & Pagination, 'order'>) {
    return (await this.orderService.findAll(filter)) as Order[];
  }

  countOrdersFiltered(order: Order[]) {
    return order.length;
  }

  async countAllOrders(filter: Omit<Data, 'order'>) {
    return await this.orderService.count(filter);
  }

  countPages(total_orders: number, per_page: number) {
    return Math.floor(total_orders / per_page);
  }

  findAllOrdersToResponse(data: {
    total: number;
    page: number;
    per_page: number;
    in_page: number;
    pages: number;
    data: Order[];
  }) {
    const { total, page, per_page, in_page, pages, data: orders } = data;
    return {
      total,
      page,
      per_page,
      in_page,
      pages,
      data: this.filterOrder(orders),
    };
  }

  filterOrder(data: Order[]) {
    try {
      return data.flatMap((order: Order) => {
        return OrderMapper.toResponse(order);
      });
    } catch (error) {
      return [];
    }
  }
}
