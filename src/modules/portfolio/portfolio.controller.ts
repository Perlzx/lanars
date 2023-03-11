import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserParam } from '../auth/auth.decorators';
import { PortfolioCreateDto } from './dto/create';
import { PortfolioUpdateDto } from './dto/update';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  public async create(@UserParam('id') userId: number, @Body() body: PortfolioCreateDto) {
    return this.portfolioService.create(userId, body);
  }

  @Get()
  public async getAll(@UserParam('id') userId: number) {
    return this.portfolioService.getAll(userId);
  }

  @Patch('/:id')
  public async update(
    @UserParam('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PortfolioUpdateDto,
  ) {
    return this.portfolioService.update(userId, id, body);
  }

  @Delete('/:id')
  public async delete(@UserParam('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.delete(userId, id);
  }
}
