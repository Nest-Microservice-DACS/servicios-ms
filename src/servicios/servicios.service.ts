import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Pool } from 'pg';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class ServiciosService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  private adapter: PrismaPg;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
    this.adapter = adapter;
  }

  private readonly logger = new Logger(ServiciosService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma conectado a la base de datos');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma desconectado de la base de datos');
  }

  create(createServicioDto: CreateServicioDto) {
    return this.servicio.create({ data: createServicioDto });
  }

  findAll() {
    return this.servicio.findMany();
  }

  findOne(id: number) {
    return this.servicio.findUnique({ where: { id } });
  }

  update(id: number, updateServicioDto: UpdateServicioDto) {
    return this.servicio.update({ where: { id }, data: updateServicioDto });
  }

  remove(id: number) {
    return this.servicio.update({ where: { id }, data: { estado: false } });
  }
}
