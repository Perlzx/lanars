import { Body, Controller, Post, Delete } from '@nestjs/common/decorators';
import { Public, UserParam } from './auth.decorators';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/login';
import { AuthRegisterDto } from './dto/register';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  public async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @Public()
  public async login(@Body() body: AuthLoginDto) {
    return this.authService.login(body);
  }

  @Delete('profile')
  public async delete(@UserParam('id') userId: number) {
    return this.authService.delete(userId);
  }
}
