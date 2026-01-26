import { ExternalApiBody } from '@bato-urbanflow/urbanflow-models';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface IExternalApiService {
  findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    name?: string,
    isActive?: boolean,
  ): Promise<ExternalApiBody[]>;

  addApi(data: ExternalApiBody): Promise<ExternalApiBody>;

  editApi(id: string, data: ExternalApiBody): Promise<UpdateResult>;

  deleteApi(id: string): Promise<DeleteResult>;
}