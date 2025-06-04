import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { RedisService } from 'src/cache/redis.service';
import { UserRepository } from 'src/user/user.repository';

@Controller('user')
export class UserController {
  constructor(
    private redis: RedisService,
    private repo: UserRepository,
  ) {}

  @Get()
  async getAllUsers() {
    const cachedUsers: string | null = await this.redis.get('getAllUsers');

    if (!cachedUsers) {
      const users = await this.repo.findAll();

      await this.redis.set('getAllUsers', JSON.stringify(users), 'EX', 15);

      console.log('From DB');

      return users;
    }

    console.log('From Cache');

    return JSON.parse(cachedUsers);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.repo.findOne(+id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
