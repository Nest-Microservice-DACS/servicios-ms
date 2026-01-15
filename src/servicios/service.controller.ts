import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceService } from './service.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Controller()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @MessagePattern({cmd: 'create_service'})
  create(@Payload() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @MessagePattern({cmd: 'get_services'})
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.serviceService.findAll(paginationDto);
  }

  @MessagePattern({cmd: 'get_service_by_id'})
  findOne(@Payload() id: number) {
    return this.serviceService.findOne(id);
  }

  @MessagePattern({cmd: 'update_service'})
  update(@Payload() {updateServiceDto, id}: {updateServiceDto: UpdateServiceDto, id: number}) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @MessagePattern({cmd: 'remove_service'})
  remove(@Payload() id: number) {
    return this.serviceService.remove(id);
  }
}
