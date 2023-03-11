import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'email address is not valid' })
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64, { message: 'password must be in range 8 to 64' })
  public password: string;
}
