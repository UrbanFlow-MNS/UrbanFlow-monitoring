import { InjectRepository } from '@nestjs/typeorm';
import { DataLogsDto } from '../Objects/DTOs/dataLogs.dto';
import { Injectable } from '@nestjs/common';
import { DataLogsEntity } from 'src/Objects/Entities/dataLogs.entity';
import { IDataLogsService } from '../Objects/Interfaces/IDataLogsService';
import { dateUtils } from '@bato-urbanflow/urbanflow-models'import { Repository } from 'typeorm';

@Injectable()
export class DataLogsService implements IDataLogsService {

  @InjectRepository(DataLogsEntity)
  public dataLogsRepository: Repository<DataLogsEntity>;

  constructor(
    @InjectRepository(DataLogsEntity)
    dataLogsRepository: Repository<DataLogsEntity>,
  ) {
    this.dataLogsRepository = dataLogsRepository;
  }

  async findWithFilters(
    numberOfElement?: number,
    startingElement?: number,
    isApi?: boolean,
    startDate?: string,
    endDate?: string,
  ): Promise<DataLogsDto[]>
  {
    let parsedStartDate : Date | undefined
    let parsedEndDate : Date | undefined
    if(startDate !== undefined){
      parsedStartDate = new Date(Date.parse(startDate))
    }
    if(endDate !== undefined){
      parsedEndDate = new Date(Date.parse(endDate))
    }

    const fetchedLogs : DataLogsDto[] = await this.dataLogsRepository.find({
      where : {
        isApi: isApi,
        dateOfData: dateUtils.getDateFindOperator(parsedStartDate,parsedEndDate)
      }
    })

    if(startingElement === undefined) {
      startingElement = 0
    } else if (startingElement >= fetchedLogs.length) {
      throw new Error("The starting element is greater than the number of element")
    }

    if(numberOfElement === undefined){
      numberOfElement = 50
    }

    return fetchedLogs.slice(startingElement, numberOfElement)
  }


}