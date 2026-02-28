import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.InvoiceCreateInput) {
    return await this.prisma.invoice.create({
      data,
    });
  }
  async update(id: string, data: Prisma.InvoiceUpdateInput) {
    return await this.prisma.invoice.update({
      where: { id },
      data,
    });
  }
  async getInvoiceById(id: string) {
    return await this.prisma.invoice.findUnique({
      where: { id },
    });
  }
  async getInvoicesByUserId(userId: string) {
    return await this.prisma.invoice.findMany({
      where: { billFromId: userId },
    });
  }
  async delete(id: string) {
    return await this.prisma.invoice.delete({
      where: { id },
    });
  }
}
