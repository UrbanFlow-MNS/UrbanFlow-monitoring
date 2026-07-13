import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExternalApiBody } from '@bato-urbanflow/urbanflow-models';
import { ExternalApiService } from './externalApi.service';
import { ExternalApiEntity } from '../Objects/Entities/externalApi.entity';
import {
  createMockRepository,
  MockRepository,
} from '../Testing/mockRepository';

const buildApi = (overrides: Partial<ExternalApiEntity> = {}): ExternalApiEntity => ({
  id: 1,
  name: 'weather',
  url: 'https://api.example.com',
  isActive: true,
  version: '1.0',
  ...overrides,
});

describe('ExternalApiService', () => {
  let service: ExternalApiService;
  let repository: MockRepository<ExternalApiEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalApiService,
        {
          provide: getRepositoryToken(ExternalApiEntity),
          useValue: createMockRepository<ExternalApiEntity>(),
        },
      ],
    }).compile();

    service = module.get<ExternalApiService>(ExternalApiService);
    repository = module.get(getRepositoryToken(ExternalApiEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findWithFilters', () => {
    it('filters by name and active state', async () => {
      const apis = [buildApi(), buildApi({ id: 2 })];
      repository.find!.mockResolvedValue(apis);

      const result = await service.findWithFilters(50, 0, 'weather', true);

      expect(result).toEqual(apis);
      const call = repository.find!.mock.calls[0][0];
      expect(call.where.isActive).toBe(true);
      expect(call.where.name).toBeDefined();
    });

    it('paginates via skip and take at the database level', async () => {
      const apis = [buildApi(), buildApi({ id: 2 })];
      repository.find!.mockResolvedValue(apis);

      const result = await service.findWithFilters(3, 1);

      expect(result).toBe(apis);
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

  it('addApi persists the api', async () => {
    const api = buildApi();
    repository.save!.mockResolvedValue(api);

    await expect(service.addApi(api as ExternalApiBody)).resolves.toEqual(api);
    expect(repository.save).toHaveBeenCalledWith(api);
  });

  it('editApi updates by id', async () => {
    const updateResult = { affected: 1, raw: [], generatedMaps: [] };
    repository.update!.mockResolvedValue(updateResult);
    const api = buildApi();

    await expect(
      service.editApi('1', api as ExternalApiBody),
    ).resolves.toEqual(updateResult);
    expect(repository.update).toHaveBeenCalledWith('1', api);
  });

  it('deleteApi removes by id', async () => {
    const deleteResult = { affected: 1, raw: [] };
    repository.delete!.mockResolvedValue(deleteResult);

    await expect(service.deleteApi('1')).resolves.toEqual(deleteResult);
    expect(repository.delete).toHaveBeenCalledWith('1');
  });
});
