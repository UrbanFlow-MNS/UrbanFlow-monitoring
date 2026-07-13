import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MicroserviceBody } from '@bato-urbanflow/urbanflow-models';
import { MicroserviceService } from './microservice.service';
import { ExternalApiEntity } from '../Objects/Entities/externalApi.entity';
import { MicroserviceEntity } from '../Objects/Entities/microservice.entity';
import {
  createMockRepository,
  MockRepository,
} from '../Testing/mockRepository';

const buildMs = (overrides: Partial<MicroserviceEntity> = {}): MicroserviceEntity => ({
  id: 1,
  name: 'auth',
  isActive: true,
  filePath: '/srv/auth',
  ...overrides,
});

describe('MicroserviceService', () => {
  let service: MicroserviceService;
  let repository: MockRepository<MicroserviceEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroserviceService,
        {
          provide: getRepositoryToken(ExternalApiEntity),
          useValue: createMockRepository<MicroserviceEntity>(),
        },
      ],
    }).compile();

    service = module.get<MicroserviceService>(MicroserviceService);
    repository = module.get(getRepositoryToken(ExternalApiEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findWithFilters', () => {
    it('filters by name and active state', async () => {
      const services = [buildMs(), buildMs({ id: 2 })];
      repository.find!.mockResolvedValue(services);

      const result = await service.findWithFilters(50, 0, 'auth', true);

      expect(result).toEqual(services);
      const call = repository.find!.mock.calls[0][0];
      expect(call.where.isActive).toBe(true);
      expect(call.where.name).toBeDefined();
    });

    it('paginates via skip and take at the database level', async () => {
      const services = [buildMs(), buildMs({ id: 2 })];
      repository.find!.mockResolvedValue(services);

      const result = await service.findWithFilters(3, 1);

      expect(result).toBe(services);
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

  it('addMs persists the microservice', async () => {
    const ms = buildMs();
    repository.save!.mockResolvedValue(ms);

    await expect(service.addMs(ms as MicroserviceBody)).resolves.toEqual(ms);
    expect(repository.save).toHaveBeenCalledWith(ms);
  });

  it('editMs updates by id', async () => {
    const updateResult = { affected: 1, raw: [], generatedMaps: [] };
    repository.update!.mockResolvedValue(updateResult);
    const ms = buildMs();

    await expect(service.editMs('1', ms as MicroserviceBody)).resolves.toEqual(
      updateResult,
    );
    expect(repository.update).toHaveBeenCalledWith('1', ms);
  });

  it('deleteMs removes by id', async () => {
    const deleteResult = { affected: 1, raw: [] };
    repository.delete!.mockResolvedValue(deleteResult);

    await expect(service.deleteMs('1')).resolves.toEqual(deleteResult);
    expect(repository.delete).toHaveBeenCalledWith('1');
  });
});
