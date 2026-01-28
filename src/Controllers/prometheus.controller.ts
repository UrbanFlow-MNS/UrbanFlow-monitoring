import { Controller, Get, Inject } from '@nestjs/common';
import * as IPrometheusService from '../Objects/Interfaces/IPrometheusService';

@Controller('prometheus')
export class PrometheusController {
  constructor(
    @Inject('IPrometheusService')
    private readonly prometheusService: IPrometheusService.IPrometheusService,
  ) {}

  @Get()
  async getMetrics(): Promise<string> {
    return await this.prometheusService.getMetrics();
  }
}
