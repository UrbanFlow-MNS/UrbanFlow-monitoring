import { Injectable } from '@nestjs/common';
import {
  DataLogsBody,
  dateUtils,
  ExternalApiBody,
} from '@bato-urbanflow/urbanflow-models';
import { IExternalApiService } from '../Objects/Interfaces/IExternalApiService';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternalApiEntity } from '../Objects/Entities/externalApi.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ExternalApiService implements IExternalApiService {
  @InjectRepository(ExternalApiEntity)
  public externalApiRepository: Repository<ExternalApiEntity>;

  constructor(
    @InjectRepository(ExternalApiEntity)
    externalApiRepository: Repository<ExternalApiEntity>,
  ) {
    this.externalApiRepository = externalApiRepository;
  }

  async findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    name?: string,
    isActive?: boolean,
  ): Promise<ExternalApiBody[]> {
    const fetchedLogs: ExternalApiBody[] =
      await this.externalApiRepository.find({
        where: {
          name: Like(`%${name}%`),
          isActive: isActive,
        },
      });

    if (startingElement === undefined) {
      startingElement = 0;
    } else if (startingElement >= fetchedLogs.length) {
      throw new Error(
        'The starting element is greater than the number of element',
      );
    }

    if (numberOfElement === undefined) {
      numberOfElement = 50;
    }

    return fetchedLogs.slice(startingElement, numberOfElement);
  }

  addApi(data: ExternalApiBody): Promise<ExternalApiBody> {
    return this.externalApiRepository.save(data);
  }
  editApi(id: string, data: ExternalApiBody): Promise<UpdateResult> {
    return this.externalApiRepository.update(id, data);
  }
  deleteApi(id: string): Promise<DeleteResult> {
    return this.externalApiRepository.delete(id);
  }
}