import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserParam } from '../auth/auth.decorators';
import { CommentService } from './comment.service';
import { CommentCreateDto } from './dto/create';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:portfolioId/:imageId')
  public async create(
    @UserParam('id') userId: number,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() body: CommentCreateDto,
  ) {
    return this.commentService.create(userId, portfolioId, imageId, body);
  }

  @Delete('/:id')
  public async delete(@UserParam('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.commentService.delete(userId, id);
  }
}
