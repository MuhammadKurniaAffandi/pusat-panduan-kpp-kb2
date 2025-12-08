import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser, UserFromJwt } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (
    data: keyof UserFromJwt | undefined,
    ctx: ExecutionContext,
  ): UserFromJwt | string | boolean | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      return null;
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
