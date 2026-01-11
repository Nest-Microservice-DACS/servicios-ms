import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { ServiciosService } from './servicios.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Controller()
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @MessagePattern({cmd: 'create_servicio'})
  create(@Payload() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }

  @MessagePattern({cmd: 'get_servicios'})
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.serviciosService.findAll(paginationDto);
  }

  @MessagePattern({cmd: 'get_servicio_by_id'})
  findOne(@Payload() id: number) {
    return this.serviciosService.findOne(id);
  }

  @MessagePattern({cmd: 'update_servicio'})
  update(@Payload() updateServicioDto: UpdateServicioDto) {
    return this.serviciosService.update(updateServicioDto.id, updateServicioDto);
  }

  @MessagePattern({cmd: 'remove_servicio'})
  remove(@Payload() id: number) {
    return this.serviciosService.remove(id);
  }
}
