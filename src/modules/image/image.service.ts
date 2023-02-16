import { DeleteObjectCommand, NotFound, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectAwsService } from 'nest-aws-sdk/dist/lib/aws-service.decorator';
import { AwsService } from 'nest-aws-sdk/dist/lib/types';
import { Repository } from 'typeorm';
import { PortfolioService } from '../portfolio/portfolio.service';
import { ImageCreateDto } from './dto/create';
import { Image } from './image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly portfolioService: PortfolioService,
    @InjectAwsService(S3Client as AwsService) private readonly s3: S3Client,
  ) {}

  public async create(userId: number, portfolioId: number, body: ImageCreateDto) {
    await this.portfolioService.get(userId, portfolioId);

    const image = await this.imageRepository.save({
      ...body,
      portfolio: { id: portfolioId },
    });

    const presignedUrl = await createPresignedPost(this.s3, {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: Image.buildKey(portfolioId, image.id),
      Expires: 3600,
      Conditions: [['content-length-range', 0, 10 * 1024 * 1024]],
    });

    return {
      id: image.id,
      name: image.name,
      description: image.description,
      presignedUrl,
    };
  }

  public async get(id: number, portfolioId: number) {
    const image = await this.imageRepository.findOne({
      where: { id, portfolio: { id: portfolioId } },
      relations: ['portfolio', 'comments'],
    });
    if (!image) {
      throw new NotFoundException();
    }

    return image.toAPI();
  }

  public async listByPortfolio(portfolioId: number, page?: number) {
    return this.imageRepository
      .find({
        skip: (page ?? 0) * 25,
        take: 25,
        where: { portfolio: { id: portfolioId } },
        order: { createdAt: 'DESC' },
        relations: ['portfolio'],
      })
      .then((r) => r.map((image) => image.toAPI()));
  }

  public async list(page?: number) {
    return this.imageRepository
      .find({
        skip: (page ?? 0) * 25,
        take: 25,
        order: { createdAt: 'DESC' },
        relations: ['portfolio'],
      })
      .then((r) => r.map((image) => image.toAPI()));
  }

  public async delete(userId: number, portfolioId: number, id: number) {
    const image = await this.imageRepository.findOne({
      where: {
        id,
        portfolio: {
          id: portfolioId,
          user: { id: userId },
        },
      },
      relations: ['portfolio'],
    });
    if (!image) {
      throw new NotFoundException();
    }

    await this.s3
      .send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: Image.buildUrl(portfolioId, id),
        }),
      )
      .catch((e) => {
        if (e instanceof NotFound) {
          return;
        }

        throw e;
      });

    await this.imageRepository.delete(id);
  }
}
