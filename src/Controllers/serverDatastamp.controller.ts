import {
  ServerDatastampBody,
} from '@bato-urbanflow/urbanflow-models';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import * as IServerDatastampService from '../Objects/Interfaces/IServerDatastampService';

@Controller('serverDatastamp')
class ServerDatastampController {
  constructor(
    @Inject('IServerDatastampService')
    private readonly serverDatastampService: IServerDatastampService.IServerDatastampService,
  ) {
    this.serverDatastampService = serverDatastampService;
  }

  @Get()
  async findWithFilters(
    @Query('numberOfElement') numberOfElement?: number,
    @Query('startingElement') startingElement?: number,
    @Query('serverName') serverName?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ServerDatastampBody[]> {
    return await this.serverDatastampService.findWithFilters(
      numberOfElement,
      startingElement,
      serverName,
      startDate,
      endDate,
    );
  }

  @Post()
  async addLog(
    @Body() data: ServerDatastampBody,
  ): Promise<ServerDatastampBody> {
    return await this.serverDatastampService.addDatastamp(data);
  }
}

export default ServerDatastampController;
