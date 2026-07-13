import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerDatastampBody } from '@bato-urbanflow/urbanflow-models';
import { ServerDatastampService } from './serverDatastamp.service';
import { ServerDatastampEntity } from '../Objects/Entities/serverDatastamp.entity';
import {
  createMockRepository,
  MockRepository,
} from '../Testing/mockRepository';

const buildDatastamp = (
  overrides: Partial<ServerDatastampEntity> = {},
): ServerDatastampEntity =>
  ({
    id: 1,
    serverName: 'node-1',
    timestamp: new Date('2026-01-01T00:00:00.000Z'),
    cpuPercent: 42,
    gpuPercent: 10,
    ramUsage: 2048,
    internalTemp: 55,
    ...overrides,
  }) as unknown as ServerDatastampEntity;

describe('ServerDatastampService', () => {
  let service: ServerDatastampService;
  let repository: MockRepository<ServerDatastampEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerDatastampService,
        {
          provide: getRepositoryToken(ServerDatastampEntity),
          useValue: createMockRepository<ServerDatastampEntity>(),
        },
      ],
    }).compile();

    service = module.get<ServerDatastampService>(ServerDatastampService);
    repository = module.get(getRepositoryToken(ServerDatastampEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findWithFilters', () => {
    it('queries without a date operator when dates are omitted', async () => {
      const stamps = [buildDatastamp(), buildDatastamp({ id: 2 })];
      repository.find!.mockResolvedValue(stamps);

      const result = await service.findWithFilters(50, 0, 'node-1');

      expect(result).toEqual(stamps);
      const call = repository.find!.mock.calls[0][0];
      expect(call.where.serverName).toBeDefined();
      expect(call.where.timestamp).toBeUndefined();
    });

    it('builds a date operator when both dates are supplied', async () => {
      repository.find!.mockResolvedValue([buildDatastamp()]);

      await service.findWithFilters(50, 0, 'node-1', '2026-01-01', '2026-02-01');

      expect(repository.find!.mock.calls[0][0].where.timestamp).toBeDefined();
    });

    it('paginates via skip and take at the database level', async () => {
      const stamps = [buildDatastamp(), buildDatastamp({ id: 2 })];
      repository.find!.mockResolvedValue(stamps);

      const result = await service.findWithFilters(3, 1);

      expect(result).toBe(stamps);
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

  it('addDatastamp persists the datastamp', async () => {
    const stamp = buildDatastamp();
    repository.save!.mockResolvedValue(stamp);

    await expect(
      service.addDatastamp(stamp as unknown as ServerDatastampBody),
    ).resolves.toEqual(stamp);
    expect(repository.save).toHaveBeenCalledWith(stamp);
  });
});
