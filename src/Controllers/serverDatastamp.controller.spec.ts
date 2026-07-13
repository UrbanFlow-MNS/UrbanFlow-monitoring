import { Test, TestingModule } from '@nestjs/testing';
import { ServerDatastampBody } from '@bato-urbanflow/urbanflow-models';
import ServerDatastampController from './serverDatastamp.controller';

describe('ServerDatastampController', () => {
  let controller: ServerDatastampController;
  let service: { findWithFilters: jest.Mock; addDatastamp: jest.Mock };

  beforeEach(async () => {
    service = { findWithFilters: jest.fn(), addDatastamp: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerDatastampController],
      providers: [{ provide: 'IServerDatastampService', useValue: service }],
    }).compile();

    controller = module.get<ServerDatastampController>(ServerDatastampController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findWithFilters forwards every payload field in order', async () => {
    const stamps = [{ serverName: 'node-1' }];
    service.findWithFilters.mockResolvedValue(stamps);

    const payload = {
      numberOfElement: 10,
      startingElement: 0,
      serverName: 'node-1',
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    };

    await expect(controller.findWithFilters(payload)).resolves.toEqual(stamps);
    expect(service.findWithFilters).toHaveBeenCalledWith(
      10,
      0,
      'node-1',
      '2026-01-01',
      '2026-02-01',
    );
  });

  it('addLog delegates to addDatastamp', async () => {
    const stamp = { serverName: 'node-1' } as unknown as ServerDatastampBody;
    service.addDatastamp.mockResolvedValue(stamp);

    await expect(controller.addLog(stamp)).resolves.toEqual(stamp);
    expect(service.addDatastamp).toHaveBeenCalledWith(stamp);
  });
});
