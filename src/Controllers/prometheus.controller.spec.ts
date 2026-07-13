import { Test, TestingModule } from '@nestjs/testing';
import express from 'express';
import { PrometheusController } from './prometheus.controller';

describe('PrometheusController', () => {
  let controller: PrometheusController;
  let service: { getMetrics: jest.Mock };

  beforeEach(async () => {
    service = { getMetrics: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrometheusController],
      providers: [{ provide: 'IPrometheusService', useValue: service }],
    }).compile();

    controller = module.get<PrometheusController>(PrometheusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sends the metrics payload with the prometheus content type', async () => {
    service.getMetrics.mockResolvedValue('metric 1');
    const send = jest.fn().mockReturnValue('sent');
    const res = { header: jest.fn(), send } as unknown as express.Response;

    const result = await controller.getMetrics(res);

    expect(service.getMetrics).toHaveBeenCalledTimes(1);
    expect(res.header).toHaveBeenCalledWith(
      'Content-Type',
      'text/plain; version=0.0.4; charset=utf-8',
    );
    expect(send).toHaveBeenCalledWith('metric 1');
    expect(result).toBe('sent');
  });
});
