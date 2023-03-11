import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { Comment } from './comment.entity';
import { CommentCreateDto } from './dto/create';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly imageService: ImageService,
  ) {}

  public async create(userId: number, portfolioId: number, imageId: number, body: CommentCreateDto) {
    await this.imageService.get(imageId, portfolioId);

    const comment = await this.commentRepository.save({
      ...body,
      user: { id: userId },
      image: { id: imageId },
    });

    return {
      id: comment.id,
      content: comment.content,
    };
  }

  public async delete(userId: number, id: number) {
    const comment = await this.commentRepository.findOne({ where: { id, user: { id: userId } } });

    if (!comment) {
      throw new NotFoundException();
    }

    await this.commentRepository.remove(comment);
  }
}
