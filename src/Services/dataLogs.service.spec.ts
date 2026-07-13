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
      });
    });

    it('forwards the isApi filter and builds a date operator', async () => {
      repository.find!.mockResolvedValue([buildDataLog()]);

      await service.findWithFilters(10, 0, true, '2026-01-01', '2026-02-01');

      const call = repository.find!.mock.calls[0][0];
      expect(call.where.isApi).toBe(true);
      expect(call.where.dateOfData).toBeDefined();
    });

    it('slices with startingElement and numberOfElement', async () => {
      const logs = Array.from({ length: 5 }, (_, index) =>
        buildDataLog({ id: index + 1 }),
      );
      repository.find!.mockResolvedValue(logs);

      const result = await service.findWithFilters(3, 1);

      expect(result).toEqual(logs.slice(1, 3));
    });

    it('throws when startingElement is out of range', async () => {
      repository.find!.mockResolvedValue([buildDataLog()]);

      await expect(service.findWithFilters(undefined, 5)).rejects.toThrow(
        'The starting element is greater than the number of element',
      );
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
