import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';

@Controller('user')
export class UserController {
  constructor(private repo: UserRepository) {}

  @Get()
  async getAllUsers() {
    const users = await this.repo.findAll();
    return users;
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
