import { Controller, Get, Inject, Res } from '@nestjs/common';
import express from 'express';
import * as IPrometheusService from '../Objects/Interfaces/IPrometheusService';

@Controller('metrics')
export class PrometheusController {
  constructor(
    @Inject('IPrometheusService')
    private readonly prometheusService: IPrometheusService.IPrometheusService,
  ) {}

  @Get()
  async getMetrics(@Res() res: express.Response) {
    const metrics = await this.prometheusService.getMetrics();
    res.header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    return res.send(metrics);
  }
}
