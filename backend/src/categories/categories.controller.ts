import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Get(':userId')
  async findAll(@Param('userId') userId: string) {
    return await this.categoriesService.findAll(userId);
  }
  @Post(':userId')
  async create(@Param('userId') userId: string, @Body('name') name: string) {
    return await this.categoriesService.create(userId, name);
  }
  @Delete(':userId/:categoryId')
  async delete(
    @Param('userId') userId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return await this.categoriesService.delete(userId, categoryId);
  }
  @Put(':userId/:categoryId')
  async update(
    @Param('userId') userId: string,
    @Param('categoryId') categoryId: string,
    @Body('name') name: string,
  ) {
    return await this.categoriesService.update(userId, categoryId, name);
  }
}
