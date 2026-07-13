import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
  DataLogsBody,
  ServerDatastampBody,
} from '@bato-urbanflow/urbanflow-models';
import { DataLogsEntity } from 'src/Objects/Entities/dataLogs.entity';
import { dateUtils } from '@bato-urbanflow/urbanflow-models';
import { Like, Repository } from 'typeorm';
import { IServerDatastampService } from '../Objects/Interfaces/IServerDatastampService';
import { ServerDatastampEntity } from '../Objects/Entities/serverDatastamp.entity';

@Injectable()
export class ServerDatastampService implements IServerDatastampService {
  @InjectRepository(ServerDatastampEntity)
  public serverDatastampRepository: Repository<ServerDatastampEntity>;

  constructor(
    @InjectRepository(ServerDatastampEntity)
    serverDatastampRepository: Repository<ServerDatastampEntity>,
  ) {
    this.serverDatastampRepository = serverDatastampRepository;
  }

  async findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    serverName?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ServerDatastampBody[]> {
    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;
    if (startDate !== undefined) {
      parsedStartDate = new Date(Date.parse(startDate));
    }
    if (endDate !== undefined) {
      parsedEndDate = new Date(Date.parse(endDate));
    }

    return await this.serverDatastampRepository.find({
      where: {
        serverName: Like(`%${serverName}%`),
        timestamp: dateUtils.getDateFindOperator(
          parsedStartDate,
          parsedEndDate,
        ),
      },
      skip: startingElement ?? 0,
      take: Math.min(numberOfElement ?? 50, 100),
    });
  }

  async addDatastamp(data: ServerDatastampBody): Promise<ServerDatastampBody> {
    return await this.serverDatastampRepository.save(data);
  }
}
