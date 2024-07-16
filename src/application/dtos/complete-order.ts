import { IsString } from 'class-validator';

export class CompleteOrderDTO {
  @IsString()
  id: string;
}
