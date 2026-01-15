import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './servicios.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiciosModule {}
