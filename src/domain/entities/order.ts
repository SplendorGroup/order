import { OrderStatus } from "../types/order-status";

export class Order {
  id?: string;
  vehicle_id: string;
  user_id: string;
  status: OrderStatus;
  payment_code: string;
  created_at: Date;
  updated_at?: Date;

    constructor(props: Order, options?: {
        update?: boolean
      }){
        Object.assign(this, props)
    
        if (!options?.update) {
          this.id = crypto.randomUUID()
        }
      }
}