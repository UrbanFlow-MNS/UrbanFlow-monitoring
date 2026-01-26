import { DeleteResult, UpdateResult } from 'typeorm';
import { MicroserviceBody } from '@bato-urbanflow/urbanflow-models';

export interface IMicroserviceService {
  findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    name?: string,
    isActive?: boolean,
  ): Promise<MicroserviceBody[]>;

  addMs(data: MicroserviceBody): Promise<MicroserviceBody>;

  editMs(id: string, data: MicroserviceBody): Promise<UpdateResult>;

  deleteMs(id: string): Promise<DeleteResult>;
}
