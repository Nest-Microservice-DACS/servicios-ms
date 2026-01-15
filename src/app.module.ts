import { Module } from '@nestjs/common';
import { ServiciosModule } from './servicios/service.module';

@Module({
  imports: [ServiciosModule],

})
export class AppModule {}
