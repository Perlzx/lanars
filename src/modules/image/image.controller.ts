import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Public, UserParam } from '../auth/auth.decorators';
import { ImageCreateDto } from './dto/create';
import { ListDto } from './dto/list';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/:portfolioId')
  public async create(
    @UserParam('id') userId: number,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Body() body: ImageCreateDto,
  ) {
    return this.imageService.create(userId, portfolioId, body);
  }

  @Get('/:portfolioId/:id')
  @Public()
  public async get(@Param('portfolioId', ParseIntPipe) portfolioId: number, @Param('id', ParseIntPipe) id: number) {
    return this.imageService.get(id, portfolioId);
  }

  @Get('/:portfolioId')
  @Public()
  public async listByPortfolio(@Param('portfolioId', ParseIntPipe) portfolioId: number, @Query() query: ListDto) {
    return this.imageService.listByPortfolio(portfolioId, query?.page || 0);
  }

  @Get()
  @Public()
  public async list(@Query() query: ListDto) {
    return this.imageService.list(query?.page || 0);
  }

  @Delete('/:portfolioId/:id')
  public async delete(
    @UserParam('id') userId: number,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.imageService.delete(userId, portfolioId, id);
  }
}
