import { DataLogsBody } from '@bato-urbanflow/urbanflow-models';
import { Controller, Inject } from '@nestjs/common';
import * as IDataLogsService from '../Objects/Interfaces/IDataLogsService';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DataLogsController {
  constructor(
    @Inject('IDataLogsService')
    private readonly dataLogsService: IDataLogsService.IDataLogsService,
  ) {}

  @MessagePattern({ cmd: 'datalogs.find' })
  async findWithFilters(
    @Payload()
    data: {
      numberOfElement?: number;
      startingElement?: number;
      isApi?: boolean;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<DataLogsBody[]> {
    return await this.dataLogsService.findWithFilters(
      data.numberOfElement,
      data.startingElement,
      data.isApi,
      data.startDate,
      data.endDate,
    );
  }

  @MessagePattern({ cmd: 'datalogs.add' })
  async addLog(@Payload() data: DataLogsBody): Promise<DataLogsBody> {
    return await this.dataLogsService.addLog(data);
  }
}
