import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { isArray } from '../helpers/validations-types.helper';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest();

  if (!user) throw new InternalServerErrorException('user no found -> request');

  if (isArray(data)) {
    const result = {};
    for (const key of data) {
      if (user.hasOwnProperty(key)) {
        result[key] = user[key];
      }
    }
    return result;
  }

  if (!isArray(data) && data) {
    return user[data];
  }

  return user;
});
