import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Pool } from 'pg';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ServiceService
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

  private readonly logger = new Logger(ServiceService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma conectado a la base de datos');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma desconectado de la base de datos');
  }


  async create(createServiceDto: CreateServiceDto) {
    try {
      return await this.service.create({ data: createServiceDto });
    } catch (error) {
      throw new RpcException({ message: 'Failed to create service', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const totalPages = await this.service.count({
        where: {
          status: true,
        },
      });

      const currentPage = paginationDto.page;
      const pageSize = paginationDto.size;

      return {
        data: await this.service.findMany({
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          where: {
            status: true,
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
      const service = await this.service.findUnique({ where: { id } });
      if (!service) {
        throw new RpcException({ message: 'Service not found', code: HttpStatus.NOT_FOUND });
      }
      return service;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({ message: 'Failed to fetch service', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      if (typeof updateServiceDto.status === 'number') {
        updateServiceDto.status = Boolean(updateServiceDto.status);
      }
      return await this.service.update({ where: { id }, data: updateServiceDto });
    } catch (error) {
      throw new RpcException({ message: 'Failed to update service', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }

  async remove(id: number) {
    try {
      return await this.service.update({ where: { id }, data: { status: false } });
    } catch (error) {
      throw new RpcException({ message: 'Failed to remove service', code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.message });
    }
  }
}
