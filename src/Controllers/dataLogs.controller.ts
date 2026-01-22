import { DataLogsDto } from "src/Objects/DTOs/dataLogs.dto";
import { Controller, Get, Query } from '@nestjs/common';
import { DataLogsService } from '../Services/dataLogs.service';

@Controller('dataLogs')
export class DataLogsController {
  constructor(private readonly dataLogsService: DataLogsService) {
    this.dataLogsService = dataLogsService;
  }

  @Get()
  async findWithFilters(
    @Query('numberOfElement') numberOfElement?: number,
    @Query('startingElement') startingElement?: number,
    @Query('isApi') isApi?: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) : Promise<DataLogsDto[]>
  {
    return await this.dataLogsService.findWithFilters(numberOfElement, startingElement, isApi , startDate, endDate);
  }

}

