import { Controller, Inject } from '@nestjs/common';
import { MicroserviceBody } from '@bato-urbanflow/urbanflow-models';
import { DeleteResult, UpdateResult } from 'typeorm';
import * as IMicroserviceService from '../Objects/Interfaces/IMicroserviceService';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MicroserviceController {
  constructor(
    @Inject('IMicroserviceService')
    private readonly microserviceService: IMicroserviceService.IMicroserviceService,
  ) {}

  @MessagePattern({ cmd: 'microservice.find' })
  async findWithFilters(
    @Payload()
    data: {
      numberOfElement?: number;
      startingElement?: number;
      name?: string;
      isActive?: boolean;
    },
  ): Promise<MicroserviceBody[]> {
    return await this.microserviceService.findWithFilters(
      data.numberOfElement,
      data.startingElement,
      data.name,
      data.isActive,
    );
  }

  @MessagePattern({ cmd: 'microservice.add' })
  async addApi(@Payload() data: MicroserviceBody): Promise<MicroserviceBody> {
    return await this.microserviceService.addMs(data);
  }

  @MessagePattern({ cmd: 'microservice.edit' })
  async editApi(
    @Payload() data: { id: string; body: MicroserviceBody },
  ): Promise<UpdateResult> {
    return await this.microserviceService.editMs(data.id, data.body);
  }

  @MessagePattern({ cmd: 'microservice.delete' })
  async deleteApi(@Payload() id: string): Promise<DeleteResult> {
    return await this.microserviceService.deleteMs(id);
  }
}
