import { DataLogsBody } from '@bato-urbanflow/urbanflow-models';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import * as IDataLogsService from '../Objects/Interfaces/IDataLogsService';

@Controller('dataLogs')
export class DataLogsController {
  constructor(
    @Inject('IDataLogsService')
    private readonly dataLogsService: IDataLogsService.IDataLogsService,
  ) {
    this.dataLogsService = dataLogsService;
  }

  @Get()
  async findWithFilters(
    @Query('numberOfElement') numberOfElement?: number,
    @Query('startingElement') startingElement?: number,
    @Query('isApi') isApi?: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<DataLogsBody[]> {
    return await this.dataLogsService.findWithFilters(
      numberOfElement,
      startingElement,
      isApi,
      startDate,
      endDate,
    );
  }

  @Post()
  async addLog(@Body() data: DataLogsBody): Promise<DataLogsBody> {
    return await this.dataLogsService.addLog(data);
  }
}

