import { performance } from 'perf_hooks';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataLogsService } from './dataLogs.service';
import { ExternalApiService } from './externalApi.service';
import { DataLogsEntity } from '../Objects/Entities/dataLogs.entity';
import { ExternalApiEntity } from '../Objects/Entities/externalApi.entity';
import {
  createMockRepository,
  MockRepository,
} from '../Testing/mockRepository';

const measure = async (action: () => Promise<unknown>): Promise<number> => {
  const start = performance.now();
  await action();
  return performance.now() - start;
};

describe('Monitoring services latency', () => {
  let dataLogsService: DataLogsService;
  let dataLogsRepository: MockRepository<DataLogsEntity>;
  let externalApiService: ExternalApiService;
  let externalApiRepository: MockRepository<ExternalApiEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataLogsService,
        {
          provide: getRepositoryToken(DataLogsEntity),
          useValue: createMockRepository<DataLogsEntity>(),
        },
        ExternalApiService,
        {
          provide: getRepositoryToken(ExternalApiEntity),
          useValue: createMockRepository<ExternalApiEntity>(),
        },
      ],
    }).compile();

    dataLogsService = module.get<DataLogsService>(DataLogsService);
    dataLogsRepository = module.get(getRepositoryToken(DataLogsEntity));
    externalApiService = module.get<ExternalApiService>(ExternalApiService);
    externalApiRepository = module.get(getRepositoryToken(ExternalApiEntity));
  });

  it('DataLogsService.findWithFilters stays under 150ms on a large dataset', async () => {
    const dataset = Array.from({ length: 10000 }, (_, index) => ({
      id: index + 1,
      isApi: true,
      targetId: index,
      dateOfData: new Date('2026-01-01T00:00:00.000Z'),
      numberOfConnection: 1,
      event: 'call',
    }));
    dataLogsRepository.find!.mockResolvedValue(dataset);

    const elapsed = await measure(() =>
      dataLogsService.findWithFilters(50, 0, true, '2026-01-01', '2026-02-01'),
    );

    expect(elapsed).toBeLessThan(150);
  });

  it('ExternalApiService.findWithFilters keeps a stable average latency', async () => {
    const dataset = Array.from({ length: 1000 }, (_, index) => ({
      id: index + 1,
      name: 'api',
      url: 'https://api.example.com',
      isActive: true,
      version: '1.0',
    }));
    externalApiRepository.find!.mockResolvedValue(dataset);

    const iterations = 50;
    let total = 0;
    for (let index = 0; index < iterations; index += 1) {
      total += await measure(() =>
        externalApiService.findWithFilters(50, 0, 'api', true),
      );
    }

    expect(total / iterations).toBeLessThan(20);
  });
});
