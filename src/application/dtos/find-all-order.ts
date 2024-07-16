import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FindAllOrderDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  vehicle_id?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsNumber()
  page?: number;
}
