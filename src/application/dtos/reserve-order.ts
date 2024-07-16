import { IsString } from 'class-validator';

export class ReserveOrderDTO {
  @IsString()
  id: string;
}
