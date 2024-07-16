import { IsString } from 'class-validator';

export class PayOrderDTO {
  @IsString()
  id: string;
}
