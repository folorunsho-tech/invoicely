import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ClientsService } from './clients.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}
  @Get(':id')
  async getClientById(@Param('id') id: string) {
    return this.clientsService.getClient(id);
  }
  @Get('relation/:relationId')
  async getClientsByRelationId(@Param('relationId') relationId: string) {
    return this.clientsService.getClientsByRelationId(relationId);
  }
  @Post()
  async createClient(@Body() data: Prisma.ClientCreateInput) {
    return this.clientsService.create(data);
  }
  @Put(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() data: Prisma.ClientUpdateInput,
  ) {
    return this.clientsService.update(id, data);
  }
  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    return this.clientsService.delete(id);
  }
}
