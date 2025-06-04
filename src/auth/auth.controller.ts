import {
  Request,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private repo: UserRepository,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() request) {
    return {
      id: request.auth.id,
      name: request.auth.name,
      email: request.auth.email,
    };
  }

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    const foundUser = await this.repo.findByEmail(user.email);

    if (foundUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Here you would typically hash the password before saving it

    const createdUser = await this.repo.create(user);

    return {
      message: `User ${createdUser.name} registered successfully`,
    };
  }

  @Post('login')
  async login(@Body() user: LoginDto) {
    const foundUser = await this.repo.findByEmail(user.email);

    if (!foundUser || foundUser.password !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Here you would typically validate the password using a hashing function

    const accessToken = this.jwtService.sign({
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
    });
    
    return { accessToken };
  }
}
