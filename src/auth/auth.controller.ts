import { Body, Controller, Get, Post } from '@nestjs/common';
import User from '../user/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Controller('auth')
export class AuthController {
  constructor(private repo: UserRepository) {}

  @Get('me')
  me() {
    return {
      name: 'John Doe',
    };
  }

  @Post('register')
  async register(@Body() user: User) {
    const createdUser = await this.repo.create(user);
    return {
      message: `User ${createdUser.name} registered successfully`,
    };
  }
}
