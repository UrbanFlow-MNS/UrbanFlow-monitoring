import { Controller } from '@nestjs/common';
import { ExternalApiService } from '../Services/dataLogs.service';

@Controller('externalApi')
export class ExternalApiController {
  constructor(private readonly externalApiService: ExternalApiService) {
    this.externalApiService = externalApiService;
  }
}