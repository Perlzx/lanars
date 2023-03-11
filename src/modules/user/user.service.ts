import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(user: Omit<User, 'id'>) {
    return this.userRepository.save(user);
  }

  public async get(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  public async delete(id: number) {
    await this.userRepository.delete(id);
  }
}
