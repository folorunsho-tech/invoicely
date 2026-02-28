import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async findAll(userId: string) {
    return await this.prisma.category.findMany({
      where: {
        userId: userId,
      },
    });
  }
  async create(userId: string, name: string) {
    return await this.prisma.category.create({
      data: {
        name: name,
        userId: userId,
      },
    });
  }
  async delete(userId: string, categoryId: string) {
    return await this.prisma.category.deleteMany({
      where: {
        id: categoryId,
        userId: userId,
      },
    });
  }
  async update(userId: string, categoryId: string, name: string) {
    return await this.prisma.category.updateMany({
      where: {
        id: categoryId,
        userId: userId,
      },
      data: {
        name: name,
      },
    });
  }
}
