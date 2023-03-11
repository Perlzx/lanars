import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from '../image/image.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 256 })
  public content: string;

  @ManyToOne(() => Image, (image) => image.comments, { onDelete: 'CASCADE' })
  public image: Image;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  public user: User;
}
