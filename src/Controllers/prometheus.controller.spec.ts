import type { Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import express from 'express';
import { PrometheusController } from './prometheus.controller';

describe('PrometheusController', () => {
  let controller: PrometheusController;
  let service: { getMetrics: Mock };

  beforeEach(async () => {
    service = { getMetrics: vi.fn() };

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
    const send = vi.fn().mockReturnValue('sent');
    const res = { header: vi.fn(), send } as unknown as express.Response;

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
