import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { ImageController } from './image.controller';
import { Image } from './image.entity';
import { ImageService } from './image.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [PortfolioModule, TypeOrmModule.forFeature([Image])],
  exports: [ImageService],
})
export class ImageModule {}
