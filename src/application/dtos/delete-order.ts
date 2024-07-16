import { IsString } from 'class-validator';

export class DeleteOrderDTO {
  @IsString()
  id: string;
}
