import { IsPositive, IsOptional } from 'class-validator';

export class ListDto {
  @IsOptional()
  @IsPositive()
  public page: number;
}
