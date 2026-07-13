import type { Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApiBody } from '@bato-urbanflow/urbanflow-models';
import { ExternalApiController } from './externalApi.controller';

describe('ExternalApiController', () => {
  let controller: ExternalApiController;
  let service: {
    findWithFilters: Mock;
    addApi: Mock;
    editApi: Mock;
    deleteApi: Mock;
  };

  beforeEach(async () => {
    service = {
      findWithFilters: vi.fn(),
      addApi: vi.fn(),
      editApi: vi.fn(),
      deleteApi: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalApiController],
      providers: [{ provide: 'IExternalApiService', useValue: service }],
    }).compile();

    controller = module.get<ExternalApiController>(ExternalApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findWithFilters forwards every payload field in order', async () => {
    const apis = [{ name: 'weather' }];
    service.findWithFilters.mockResolvedValue(apis);

    const payload = {
      numberOfElement: 10,
      startingElement: 0,
      name: 'weather',
      isActive: true,
    };

    await expect(controller.findWithFilters(payload)).resolves.toEqual(apis);
    expect(service.findWithFilters).toHaveBeenCalledWith(10, 0, 'weather', true);
  });

  it('addApi delegates to the service', async () => {
    const api = { name: 'weather' } as ExternalApiBody;
    service.addApi.mockResolvedValue(api);

    await expect(controller.addApi(api)).resolves.toEqual(api);
    expect(service.addApi).toHaveBeenCalledWith(api);
  });

  it('editApi forwards the id and body', async () => {
    const body = { name: 'weather' } as ExternalApiBody;
    const updateResult = { affected: 1 };
    service.editApi.mockResolvedValue(updateResult);

    await expect(
      controller.editApi({ id: '1', body }),
    ).resolves.toEqual(updateResult);
    expect(service.editApi).toHaveBeenCalledWith('1', body);
  });

  it('deleteApi forwards the id', async () => {
    const deleteResult = { affected: 1 };
    service.deleteApi.mockResolvedValue(deleteResult);

    await expect(controller.deleteApi('1')).resolves.toEqual(deleteResult);
    expect(service.deleteApi).toHaveBeenCalledWith('1');
  });
});
