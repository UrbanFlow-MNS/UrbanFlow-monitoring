import { Injectable } from '@nestjs/common';
import {
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
    return await this.externalApiRepository.find({
      where: {
        name: Like(`%${name}%`),
        isActive: isActive,
      },
      skip: startingElement ?? 0,
      take: Math.min(numberOfElement ?? 50, 100),
    });
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