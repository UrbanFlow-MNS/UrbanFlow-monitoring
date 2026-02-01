import {
  Body,
  Controller,
  Delete,
  Get, Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  MicroserviceBody,
} from '@bato-urbanflow/urbanflow-models';
import { DeleteResult, UpdateResult } from 'typeorm';
import * as IMicroserviceService from '../Objects/Interfaces/IMicroserviceService';

@Controller('microservice')
export class MicroserviceController {
  constructor(
    @Inject('IMicroserviceService')
    private readonly microserviceService: IMicroserviceService.IMicroserviceService,
  ) {
    this.microserviceService = microserviceService;
  }

  @Get()
  async findWithFilters(
    @Query('numberOfElement') numberOfElement?: number,
    @Query('startingElement') startingElement?: number,
    @Query('name') name?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<MicroserviceBody[]> {
    return await this.microserviceService.findWithFilters(
      numberOfElement,
      startingElement,
      name,
      isActive,
    );
  }

  @Post()
  async addApi(@Body() data: MicroserviceBody): Promise<MicroserviceBody> {
    return await this.microserviceService.addMs(data);
  }

  @Put('/:id')
  async editApi(
    @Param('id') id: string,
    @Body() data: MicroserviceBody,
  ): Promise<UpdateResult> {
    return await this.microserviceService.editMs(id, data);
  }

  @Delete('/:id')
  async deleteApi(@Param('id') id: string): Promise<DeleteResult> {
    return await this.microserviceService.deleteMs(id);
  }
}
