import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthLoginDto } from './dto/login';
import { AuthRegisterDto } from './dto/register';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  public async register(body: AuthRegisterDto) {
    let user = await this.userService.get(body.email);
    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashPassword = await bcrypt.hash(body.password, 7);
    user = await this.userService.create({
      email: body.email,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  public async login(body: AuthLoginDto) {
    const user = await this.userService.get(body.email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateToken(user);
  }

  public async delete(userId: number) {
    await this.userService.delete(userId);
  }

  private async generateToken(user: User) {
    return { token: this.jwtService.sign({ id: user.id, email: user.email }) };
  }
}
