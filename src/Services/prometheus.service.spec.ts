import { PrometheusService } from './prometheus.service';

describe('PrometheusService', () => {
  let service: PrometheusService;

  beforeEach(() => {
    service = new PrometheusService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('exposes default process metrics as text', async () => {
    const metrics = await service.getMetrics();

    expect(typeof metrics).toBe('string');
    expect(metrics).toContain('process_cpu_user_seconds_total');
  });

  it('tags the metrics with the application default label', async () => {
    const metrics = await service.getMetrics();

    expect(metrics).toContain('app="nestjs-prometheus"');
  });
});
