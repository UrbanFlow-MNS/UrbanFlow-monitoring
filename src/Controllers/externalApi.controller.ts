import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ExternalApiBody,
} from '@bato-urbanflow/urbanflow-models';
import { DeleteResult, UpdateResult } from 'typeorm';
import * as IExternalApiService from '../Objects/Interfaces/IExternalApiService';

@Controller('externalApi')
export class ExternalApiController {
  constructor(
    private readonly externalApiService: IExternalApiService.IExternalApiService,
  ) {
    this.externalApiService = externalApiService;
  }

  @Get()
  async findWithFilters(
    @Query('numberOfElement') numberOfElement?: number,
    @Query('startingElement') startingElement?: number,
    @Query('name') name?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<ExternalApiBody[]> {
    return await this.externalApiService.findWithFilters(
      numberOfElement,
      startingElement,
      name,
      isActive,
    );
  }

  @Post()
  async addApi(@Body() data: ExternalApiBody): Promise<ExternalApiBody> {
    return await this.externalApiService.addApi(data);
  }

  @Put('/:id')
  async editApi(
    @Param('id') id: string,
    @Body() data: ExternalApiBody,
  ): Promise<UpdateResult> {
    return await this.externalApiService.editApi(id, data);
  }

  @Delete('/:id')
  async deleteApi(@Param('id') id: string): Promise<DeleteResult> {
    return await this.externalApiService.deleteApi(id);
  }
}