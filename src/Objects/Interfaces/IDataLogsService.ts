import { DataLogsBody } from '@bato-urbanflow/urbanflow-models';

export interface IDataLogsService {

  findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    isApi?: boolean,
    startDate?: string,
    endDate?: string,
  ): Promise<DataLogsBody[]>;

  addLog(data: DataLogsBody): Promise<DataLogsBody>;
}