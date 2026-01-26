import {
  ServerDatastampBody,
} from '@bato-urbanflow/urbanflow-models';

export interface IServerDatastampService {
  findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    name?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ServerDatastampBody[]>;

  addDatastamp(data: ServerDatastampBody): Promise<ServerDatastampBody>;
}
