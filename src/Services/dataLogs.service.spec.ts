import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataLogsBody } from '@bato-urbanflow/urbanflow-models';
import { DataLogsService } from './dataLogs.service';
import { DataLogsEntity } from '../Objects/Entities/dataLogs.entity';
import {
  createMockRepository,
  MockRepository,
} from '../Testing/mockRepository';

const buildDataLog = (overrides: Partial<DataLogsEntity> = {}): DataLogsEntity => ({
  id: 1,
  isApi: true,
  targetId: 5,
  dateOfData: new Date('2026-01-01T00:00:00.000Z'),
  numberOfConnection: 3,
  event: 'call',
  ...overrides,
});

describe('DataLogsService', () => {
  let service: DataLogsService;
  let repository: MockRepository<DataLogsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataLogsService,
        {
          provide: getRepositoryToken(DataLogsEntity),
          useValue: createMockRepository<DataLogsEntity>(),
        },
      ],
    }).compile();

    service = module.get<DataLogsService>(DataLogsService);
    repository = module.get(getRepositoryToken(DataLogsEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findWithFilters', () => {
    it('queries without a date operator when dates are omitted', async () => {
      const logs = [buildDataLog(), buildDataLog({ id: 2 })];
      repository.find!.mockResolvedValue(logs);

      const result = await service.findWithFilters();

      expect(result).toEqual(logs);
      expect(repository.find).toHaveBeenCalledWith({
        where: { isApi: undefined, dateOfData: undefined },
        skip: 0,
        take: 50,
      });
    });

    it('forwards the isApi filter and builds a date operator', async () => {
      repository.find!.mockResolvedValue([buildDataLog()]);

      await service.findWithFilters(10, 0, true, '2026-01-01', '2026-02-01');

      const call = repository.find!.mock.calls[0][0];
      expect(call.where.isApi).toBe(true);
      expect(call.where.dateOfData).toBeDefined();
    });

    it('paginates via skip and take at the database level', async () => {
      const logs = [buildDataLog(), buildDataLog({ id: 2 })];
      repository.find!.mockResolvedValue(logs);

      const result = await service.findWithFilters(3, 1);

      expect(result).toBe(logs);
      expect(repository.find!.mock.calls[0][0]).toMatchObject({
        skip: 1,
        take: 3,
      });
    });

    it('caps take at 100 to prevent unbounded queries', async () => {
      repository.find!.mockResolvedValue([]);

      await service.findWithFilters(500, 0);

      expect(repository.find!.mock.calls[0][0]).toMatchObject({
        skip: 0,
        take: 100,
      });
    });
  });

  describe('addLog', () => {
    it('persists the data log', async () => {
      const log = buildDataLog();
      repository.save!.mockResolvedValue(log);

      await expect(service.addLog(log as DataLogsBody)).resolves.toEqual(log);
      expect(repository.save).toHaveBeenCalledWith(log);
    });
  });
});
