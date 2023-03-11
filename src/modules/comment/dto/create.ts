import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CommentCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 256, { message: 'content must be in range 1 to 256' })
  public content: string;
}
