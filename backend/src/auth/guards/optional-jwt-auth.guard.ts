import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If token is missing or it is invalid, I don't want to throw an error,
    // instead we just handle the visitor as as guest
    return user || null;
  }
}
