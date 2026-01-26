import { Injectable } from '@nestjs/common';
import {
  ExternalApiBody,
  MicroserviceBody,
} from '@bato-urbanflow/urbanflow-models';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternalApiEntity } from '../Objects/Entities/externalApi.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { IMicroserviceService } from '../Objects/Interfaces/IMicroserviceService';
import { MicroserviceEntity } from '../Objects/Entities/microservice.entity';

@Injectable()
export class MicroserviceService implements IMicroserviceService {
  @InjectRepository(ExternalApiEntity)
  public microserviceRepository: Repository<MicroserviceEntity>;

  constructor(
    @InjectRepository(ExternalApiEntity)
    microserviceRepository: Repository<MicroserviceEntity>,
  ) {
    this.microserviceRepository = microserviceRepository;
  }

  async findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    name?: string,
    isActive?: boolean,
  ): Promise<MicroserviceBody[]> {
    const fetchedMicroservices: MicroserviceBody[] =
      await this.microserviceRepository.find({
        where: {
          name: Like(`%${name}%`),
          isActive: isActive,
        },
      });

    if (startingElement === undefined) {
      startingElement = 0;
    } else if (startingElement >= fetchedMicroservices.length) {
      throw new Error(
        'The starting element is greater than the number of element',
      );
    }

    if (numberOfElement === undefined) {
      numberOfElement = 50;
    }

    return fetchedMicroservices.slice(startingElement, numberOfElement);
  }

  addMs(data: MicroserviceBody): Promise<MicroserviceBody> {
    return this.microserviceRepository.save(data);
  }
  editMs(id: string, data: MicroserviceBody): Promise<UpdateResult> {
    return this.microserviceRepository.update(id, data);
  }
  deleteMs(id: string): Promise<DeleteResult> {
    return this.microserviceRepository.delete(id);
  }
}
