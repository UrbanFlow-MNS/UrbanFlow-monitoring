import type { Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { MicroserviceBody } from '@bato-urbanflow/urbanflow-models';
import { MicroserviceController } from './microservice.controller';

describe('MicroserviceController', () => {
  let controller: MicroserviceController;
  let service: {
    findWithFilters: Mock;
    addMs: Mock;
    editMs: Mock;
    deleteMs: Mock;
  };

  beforeEach(async () => {
    service = {
      findWithFilters: vi.fn(),
      addMs: vi.fn(),
      editMs: vi.fn(),
      deleteMs: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicroserviceController],
      providers: [{ provide: 'IMicroserviceService', useValue: service }],
    }).compile();

    controller = module.get<MicroserviceController>(MicroserviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findWithFilters forwards every payload field in order', async () => {
    const services = [{ name: 'auth' }];
    service.findWithFilters.mockResolvedValue(services);

    const payload = {
      numberOfElement: 10,
      startingElement: 0,
      name: 'auth',
      isActive: true,
    };

    await expect(controller.findWithFilters(payload)).resolves.toEqual(services);
    expect(service.findWithFilters).toHaveBeenCalledWith(10, 0, 'auth', true);
  });

  it('addApi delegates to addMs', async () => {
    const ms = { name: 'auth' } as MicroserviceBody;
    service.addMs.mockResolvedValue(ms);

    await expect(controller.addApi(ms)).resolves.toEqual(ms);
    expect(service.addMs).toHaveBeenCalledWith(ms);
  });

  it('editApi forwards the id and body to editMs', async () => {
    const body = { name: 'auth' } as MicroserviceBody;
    const updateResult = { affected: 1 };
    service.editMs.mockResolvedValue(updateResult);

    await expect(controller.editApi({ id: '1', body })).resolves.toEqual(
      updateResult,
    );
    expect(service.editMs).toHaveBeenCalledWith('1', body);
  });

  it('deleteApi forwards the id to deleteMs', async () => {
    const deleteResult = { affected: 1 };
    service.deleteMs.mockResolvedValue(deleteResult);

    await expect(controller.deleteApi('1')).resolves.toEqual(deleteResult);
    expect(service.deleteMs).toHaveBeenCalledWith('1');
  });
});
