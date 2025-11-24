import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser, UserFromJwt } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (
    data: keyof UserFromJwt | undefined,
    ctx: ExecutionContext,
  ): UserFromJwt | string | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      return null;
    }

    if (data) {
      const value = user[data];
      // Type guard: hanya return jika valuenya string atau null
      if (typeof value === 'string' || value === null) {
        return value;
      }
      // Untuk boolean, convert ke string
      if (typeof value === 'boolean') {
        return value.toString();
      }
      return null;
    }

    return user;
  },
);
