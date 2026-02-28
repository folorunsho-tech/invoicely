import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [PrismaService],
})
export class CategoriesModule {}
