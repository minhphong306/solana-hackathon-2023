import {ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
