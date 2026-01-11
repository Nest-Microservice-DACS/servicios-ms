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
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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


  async create(createServicioDto: CreateServicioDto) {
    try {
      return await this.servicio.create({ data: createServicioDto });
    } catch (error) {
      throw new RpcException({ message: 'Failed to create service', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const totalPages = await this.servicio.count({
        where: {
          estado: true,
        },
      });

      const currentPage = paginationDto.page;
      const pageSize = paginationDto.size;

      return {
        data: await this.servicio.findMany({
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          where: {
            estado: true,
          },
        }),
        meta: {
          total: totalPages,
          page: currentPage,
          lastPage: Math.ceil(totalPages / pageSize),
        },
      };
    } catch (error) {
      throw new RpcException({ message: 'Failed to fetch services', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }

  async findOne(id: number) {
    try {
      const servicio = await this.servicio.findUnique({ where: { id } });
      if (!servicio) {
        throw new RpcException({ message: 'Service not found', code: HttpStatus.NOT_FOUND });
      }
      return servicio;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({ message: 'Failed to fetch service', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }

  async update(id: number, updateServicioDto: UpdateServicioDto) {
    try {
      if (typeof updateServicioDto.estado === 'number') {
        updateServicioDto.estado = Boolean(updateServicioDto.estado);
      }
      return await this.servicio.update({ where: { id }, data: updateServicioDto });
    } catch (error) {
      throw new RpcException({ message: 'Failed to update service', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }

  async remove(id: number) {
    try {
      return await this.servicio.update({ where: { id }, data: { estado: false } });
    } catch (error) {
      throw new RpcException({ message: 'Failed to remove service', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }
}
