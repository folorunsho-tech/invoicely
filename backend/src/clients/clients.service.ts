import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}
  async getClient(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        invoices: {
          include: {
            items: true,
            billFrom: true,
            billTo: true,
          },
        },
      },
    });
  }
  async getClientsByRelationId(relationId: string) {
    return this.prisma.client.findMany({
      where: { relatedToId: relationId },
    });
  }
  async create(data: Prisma.ClientCreateInput) {
    return this.prisma.client.create({
      data,
    });
  }
  async update(id: string, data: Prisma.ClientUpdateInput) {
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }
  async delete(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }
}
