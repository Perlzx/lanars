import { createParamDecorator, SetMetadata } from '@nestjs/common/decorators';
import { ExecutionContext } from '@nestjs/common/interfaces';

export const Public = () => SetMetadata('isPublic', true);

export const UserParam = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: JwtPayload = request.user;

  return data ? user?.[data] : user;
});

export type JwtPayload = { id: number; email: string };
