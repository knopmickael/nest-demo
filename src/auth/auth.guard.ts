import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const userdata = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      if (!userdata) {
        throw new UnauthorizedException('Invalid token');
      }
      
      request.auth = userdata;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
