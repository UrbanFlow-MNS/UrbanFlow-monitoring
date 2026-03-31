import { Controller, Inject } from '@nestjs/common';
import { ExternalApiBody } from '@bato-urbanflow/urbanflow-models';
import { DeleteResult, UpdateResult } from 'typeorm';
import * as IExternalApiService from '../Objects/Interfaces/IExternalApiService';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ExternalApiController {
  constructor(
    @Inject('IExternalApiService')
    private readonly externalApiService: IExternalApiService.IExternalApiService,
  ) {}

  @MessagePattern({ cmd: 'external_api.find' })
  async findWithFilters(
    @Payload()
    data: {
      numberOfElement?: number;
      startingElement?: number;
      name?: string;
      isActive?: boolean;
    },
  ): Promise<ExternalApiBody[]> {
    return await this.externalApiService.findWithFilters(
      data.numberOfElement,
      data.startingElement,
      data.name,
      data.isActive,
    );
  }

  @MessagePattern({ cmd: 'external_api.add' })
  async addApi(@Payload() data: ExternalApiBody): Promise<ExternalApiBody> {
    return await this.externalApiService.addApi(data);
  }

  @MessagePattern({ cmd: 'external_api.edit' })
  async editApi(
    @Payload() data: { id: string; body: ExternalApiBody },
  ): Promise<UpdateResult> {
    return await this.externalApiService.editApi(data.id, data.body);
  }

  @MessagePattern({ cmd: 'external_api.delete' })
  async deleteApi(@Payload() id: string): Promise<DeleteResult> {
    return await this.externalApiService.deleteApi(id);
  }
}
