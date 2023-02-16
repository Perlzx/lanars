import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from '../portfolio/portfolio.entity';
import { Comment } from '../comment/comment.entity';

@Entity({ name: 'image' })
export class Image {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 128 })
  public name: string;

  @Column({ length: 2048, nullable: true })
  public description: string | null;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.images, { onDelete: 'CASCADE' })
  public portfolio: Portfolio;

  @OneToMany(() => Comment, (comment) => comment.image)
  public comments: Comment[];

  @Index('createdAt-index')
  @CreateDateColumn()
  public createdAt: Date;

  public toAPI() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      url: Image.buildUrl(this.portfolio.id, this.id),
      createdAt: this.createdAt,
      ...(this.comments && {
        comments: this.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
        })),
      }),
      ...(this.portfolio && {
        portfolio: {
          name: this.portfolio.name,
        },
      }),
    };
  }

  public static buildUrl(portfolioId: number, id: number) {
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Image.buildKey(
      portfolioId,
      id,
    )}`;
  }

  public static buildKey(portfolioId: number, id: number) {
    return `images/${portfolioId}/${id}.jpg`;
  }
}
