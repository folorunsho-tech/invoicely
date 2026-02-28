import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InvoicesService } from './invoices.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}
  @Get(':id')
  async getInvoiceById(@Param(':id') id: string) {
    return await this.invoicesService.getInvoiceById(id);
  }
  @Get('user/:userId')
  async getInvoicesByUserId(@Param('userId') userId: string) {
    return await this.invoicesService.getInvoicesByUserId(userId);
  }
  @Post()
  async createInvoice(@Body() data: Prisma.InvoiceCreateInput) {
    return await this.invoicesService.create(data);
  }
  @Put(':id')
  async updateInvoice(
    @Param(':id') id: string,
    @Body() data: Prisma.InvoiceUpdateInput,
  ) {
    return await this.invoicesService.update(id, data);
  }
  @Delete(':id')
  async deleteInvoice(@Param(':id') id: string) {
    return await this.invoicesService.delete(id);
  }
}
