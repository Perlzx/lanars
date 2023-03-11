import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { PortfolioCreateDto } from './dto/create';
import { PortfolioUpdateDto } from './dto/update';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  public async create(userId: number, body: PortfolioCreateDto) {
    const portfolio = await this.portfolioRepository.save({
      ...body,
      user: { id: userId },
    });

    return {
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description,
    };
  }

  public async get(userId: number, id: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!portfolio) {
      throw new NotFoundException();
    }

    return portfolio;
  }

  public async getAll(userId: number) {
    return this.portfolioRepository.find({
      where: { user: { id: userId } },
    });
  }

  public async update(userId: number, id: number, body: PortfolioUpdateDto) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!portfolio) {
      throw new NotFoundException();
    }

    await this.portfolioRepository.update(id, body);
  }

  public async delete(userId: number, id: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!portfolio) {
      throw new NotFoundException();
    }

    await this.portfolioRepository.delete(id);
  }
}
