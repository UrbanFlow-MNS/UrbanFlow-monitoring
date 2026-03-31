import { ServerDatastampBody } from '@bato-urbanflow/urbanflow-models';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as IServerDatastampService from '../Objects/Interfaces/IServerDatastampService';

@Controller()
export class ServerDatastampController {
  constructor(
    @Inject('IServerDatastampService')
    private readonly serverDatastampService: IServerDatastampService.IServerDatastampService,
  ) {}

  @MessagePattern({ cmd: 'server_datastamp.find' })
  async findWithFilters(
    @Payload()
    data: {
      numberOfElement?: number;
      startingElement?: number;
      serverName?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ServerDatastampBody[]> {
    return await this.serverDatastampService.findWithFilters(
      data.numberOfElement,
      data.startingElement,
      data.serverName,
      data.startDate,
      data.endDate,
    );
  }

  @MessagePattern({ cmd: 'server_datastamp.add' })
  async addLog(
    @Payload() data: ServerDatastampBody,
  ): Promise<ServerDatastampBody> {
    return await this.serverDatastampService.addDatastamp(data);
  }
}

export default ServerDatastampController;
