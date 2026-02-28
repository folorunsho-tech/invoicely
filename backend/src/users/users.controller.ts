import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get(':id')
  async findUser(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }
  async createUser(@Body() data: Prisma.UserCreateInput) {
    return await this.usersService.create(data);
  }
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    return await this.usersService.update(id, data);
  }
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
