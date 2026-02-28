import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  imports: [PrismaService],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
