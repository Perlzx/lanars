import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from '../image/image.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'portfolio' })
export class Portfolio {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 128 })
  public name: string;

  @Column({ length: 2048, nullable: true })
  public description: string | null;

  @OneToMany(() => Image, (image) => image.portfolio)
  public images: Image[];

  @ManyToOne(() => User, (user) => user.portfolios, { onDelete: 'CASCADE' })
  public user: User;
}
