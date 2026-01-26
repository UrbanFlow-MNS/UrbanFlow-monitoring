import {
  ServerDatastampBody,
} from '@bato-urbanflow/urbanflow-models';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ServerDatastampService } from '../Services/serverDatastamp.service';

@Controller('dataLogs')
export class ServerDatastampController {
  constructor(private readonly serverDatastampService: ServerDatastampService) {
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
