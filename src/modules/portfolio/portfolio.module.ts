import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { Portfolio } from './portfolio.entity';
import { PortfolioService } from './portfolio.service';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService],
  imports: [TypeOrmModule.forFeature([Portfolio])],
  exports: [PortfolioService],
})
export class PortfolioModule {}
