import { Order } from '../entities/order';
import { OrderStatus } from '../enums/order-status';
import { DateValuesObject } from '../values-object/date';

export class OrderMapper {
  static toDomain(raw: any): Order {
    return new Order({
      id: raw?._id,
      vehicle_id: raw?.vehicle_id,
      user_id: raw?.user_id,
      status: raw?.status as OrderStatus,
      payment_code: raw?.payment_code,
      created_at: new DateValuesObject(raw?.created_at).toDate(),
      updated_at: raw?.created_at ? new DateValuesObject(raw?.updated_at).toDate() : undefined,
    });
  }

  static toPersistence(order: Order) {
    return {
      _id: order?.id,
      vehicle_id: order?.vehicle_id,
      user_id: order?.user_id,
      status: order?.status,
      payment_code: order?.payment_code,
      created_at: order?.created_at ? new DateValuesObject(order?.created_at).toDate() : undefined,
      updated_at: order?.updated_at ? new DateValuesObject(order?.updated_at).toDate() : undefined,
    };
  }

  static toResponse(order: Order) {
    return {
      id: order?.id,
      vehicleId: order?.vehicle_id,
      userId: order?.user_id,
      status: order?.status,
      paymentCode: order?.payment_code,
      created_at: order?.created_at ? new DateValuesObject(order?.created_at).toISOString() : undefined,
      updated_at: order?.updated_at ? new DateValuesObject(order?.updated_at).toISOString() : undefined,
    };
  }
}
