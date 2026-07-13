import { Test, TestingModule } from '@nestjs/testing';
import { DataLogsBody } from '@bato-urbanflow/urbanflow-models';
import { DataLogsController } from './dataLogs.controller';

describe('DataLogsController', () => {
  let controller: DataLogsController;
  let service: { findWithFilters: jest.Mock; addLog: jest.Mock };

  beforeEach(async () => {
    service = { findWithFilters: jest.fn(), addLog: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataLogsController],
      providers: [{ provide: 'IDataLogsService', useValue: service }],
    }).compile();

    controller = module.get<DataLogsController>(DataLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findWithFilters forwards every payload field in order', async () => {
    const logs = [{ event: 'call' }];
    service.findWithFilters.mockResolvedValue(logs);

    const payload = {
      numberOfElement: 10,
      startingElement: 0,
      isApi: true,
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    };

    await expect(controller.findWithFilters(payload)).resolves.toEqual(logs);
    expect(service.findWithFilters).toHaveBeenCalledWith(
      10,
      0,
      true,
      '2026-01-01',
      '2026-02-01',
    );
  });

  it('addLog delegates to the service', async () => {
    const log = { event: 'call' } as DataLogsBody;
    service.addLog.mockResolvedValue(log);

    await expect(controller.addLog(log)).resolves.toEqual(log);
    expect(service.addLog).toHaveBeenCalledWith(log);
  });
});
