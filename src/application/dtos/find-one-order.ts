import { IsString } from 'class-validator';

export class FindOneOrderDTO {
  @IsString()
  id: string;
}
