import { DataLogsDto } from '../DTOs/dataLogs.dto';

export interface IDataLogsService {

  findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    isApi?: boolean,
    startDate?: string,
    endDate?: string,
  ): Promise<DataLogsDto[]>;
}