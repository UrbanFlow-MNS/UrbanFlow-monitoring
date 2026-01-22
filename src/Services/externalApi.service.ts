import { Injectable } from '@nestjs/common';
import { ExternalApiBody } from '@bato-urbanflow/urbanflow-models';
import { IExternalApiService } from '../Objects/Interfaces/IDataLogsService';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternalApiEntity } from '../Objects/Entities/dataLogs.entity';
import { Repository } from 'typeorm';

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
}