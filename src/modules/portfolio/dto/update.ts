import { IsOptional, IsString, Length, IsDefined } from 'class-validator';

export class PortfolioUpdateDto {
  @IsDefined()
  @IsString()
  @Length(1, 128, { message: 'name must be in range 1 to 128' })
  public name: string;

  @IsOptional()
  @IsString()
  @Length(1, 2048, { message: 'description must be in range 1 to 2048' })
  public description: string | null;
}
