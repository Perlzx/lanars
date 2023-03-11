import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Portfolio } from '../portfolio/portfolio.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 320, nullable: false })
  public email: string;

  @Column({ length: 64, nullable: false })
  public password: string;

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  public portfolios?: Portfolio[];

  @OneToMany(() => Comment, (comment) => comment.user)
  public comments?: Comment[];
}
