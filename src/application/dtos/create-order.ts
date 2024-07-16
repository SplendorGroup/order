import { IsString, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '@/domain/enums/order-status';

export class CreateOrderDTO {
  @IsString()
  vehicle_id: string;

  user_id: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  payment_code?: string;
}
