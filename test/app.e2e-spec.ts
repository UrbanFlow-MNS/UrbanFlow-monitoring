import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { PrometheusController } from './../src/Controllers/prometheus.controller';
import { PrometheusService } from './../src/Services/prometheus.service';
import { DataLogsController } from './../src/Controllers/dataLogs.controller';
import { ExternalApiController } from './../src/Controllers/externalApi.controller';
import { MicroserviceController } from './../src/Controllers/microservice.controller';
import ServerDatastampController from './../src/Controllers/serverDatastamp.controller';
import { DataLogsService } from './../src/Services/dataLogs.service';
import { ExternalApiService } from './../src/Services/externalApi.service';
import { MicroserviceService } from './../src/Services/microservice.service';
import { ServerDatastampService } from './../src/Services/serverDatastamp.service';
import { DataLogsEntity } from './../src/Objects/Entities/dataLogs.entity';
import { ExternalApiEntity } from './../src/Objects/Entities/externalApi.entity';
import { ServerDatastampEntity } from './../src/Objects/Entities/serverDatastamp.entity';

const createRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('Monitoring API (e2e)', () => {
  let app: INestApplication<App>;
  let dataLogsController: DataLogsController;
  let externalApiController: ExternalApiController;
  let microserviceController: MicroserviceController;
  let serverDatastampController: ServerDatastampController;

  const dataLogsRepo = createRepo();
  const externalApiRepo = createRepo();
  const serverDatastampRepo = createRepo();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        AppController,
        PrometheusController,
        DataLogsController,
        ExternalApiController,
        MicroserviceController,
        ServerDatastampController,
      ],
      providers: [
        AppService,
        PrometheusService,
        { provide: 'IPrometheusService', useClass: PrometheusService },
        DataLogsService,
        { provide: 'IDataLogsService', useClass: DataLogsService },
        ExternalApiService,
        { provide: 'IExternalApiService', useClass: ExternalApiService },
        MicroserviceService,
        { provide: 'IMicroserviceService', useClass: MicroserviceService },
        ServerDatastampService,
        { provide: 'IServerDatastampService', useClass: ServerDatastampService },
        { provide: getRepositoryToken(DataLogsEntity), useValue: dataLogsRepo },
        { provide: getRepositoryToken(ExternalApiEntity), useValue: externalApiRepo },
        { provide: getRepositoryToken(ServerDatastampEntity), useValue: serverDatastampRepo },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataLogsController = app.get(DataLogsController);
    externalApiController = app.get(ExternalApiController);
    microserviceController = app.get(MicroserviceController);
    serverDatastampController = app.get(ServerDatastampController);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET / returns the health message', async () => {
    const response = await request(app.getHttpServer()).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  it('GET /metrics exposes prometheus metrics', async () => {
    const response = await request(app.getHttpServer()).get('/metrics');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.text).toContain('process_cpu_user_seconds_total');
  });

  it('datalogs.find flows through the service and repository', async () => {
    const logs = [{ id: 1, event: 'call' }];
    dataLogsRepo.find.mockResolvedValue(logs);

    const result = await dataLogsController.findWithFilters({
      numberOfElement: 50,
      startingElement: 0,
      isApi: true,
    });

    expect(result).toEqual(logs);
    expect(dataLogsRepo.find).toHaveBeenCalledTimes(1);
  });

  it('datalogs.add persists through the repository', async () => {
    const log = { id: 1, event: 'call' };
    dataLogsRepo.save.mockResolvedValue(log);

    const result = await dataLogsController.addLog(log as never);

    expect(result).toEqual(log);
    expect(dataLogsRepo.save).toHaveBeenCalledWith(log);
  });

  it('external_api.find flows through the service and repository', async () => {
    const apis = [{ id: 1, name: 'weather' }];
    externalApiRepo.find.mockResolvedValue(apis);

    const result = await externalApiController.findWithFilters({
      numberOfElement: 50,
      startingElement: 0,
      name: 'weather',
      isActive: true,
    });

    expect(result).toEqual(apis);
    expect(externalApiRepo.find).toHaveBeenCalledTimes(1);
  });

  it('external_api.edit and delete flow through the repository', async () => {
    externalApiRepo.update.mockResolvedValue({ affected: 1 });
    externalApiRepo.delete.mockResolvedValue({ affected: 1 });

    await externalApiController.editApi({ id: '1', body: { name: 'weather' } as never });
    await externalApiController.deleteApi('1');

    expect(externalApiRepo.update).toHaveBeenCalledWith('1', { name: 'weather' });
    expect(externalApiRepo.delete).toHaveBeenCalledWith('1');
  });

  it('microservice.find flows through the shared repository', async () => {
    const services = [{ id: 1, name: 'auth' }];
    externalApiRepo.find.mockResolvedValue(services);

    const result = await microserviceController.findWithFilters({
      numberOfElement: 50,
      startingElement: 0,
      name: 'auth',
      isActive: true,
    });

    expect(result).toEqual(services);
  });

  it('server_datastamp.find flows through the service and repository', async () => {
    const stamps = [{ id: 1, serverName: 'node-1' }];
    serverDatastampRepo.find.mockResolvedValue(stamps);

    const result = await serverDatastampController.findWithFilters({
      numberOfElement: 50,
      startingElement: 0,
      serverName: 'node-1',
    });

    expect(result).toEqual(stamps);
    expect(serverDatastampRepo.find).toHaveBeenCalledTimes(1);
  });

  it('server_datastamp.add persists through the repository', async () => {
    const stamp = { id: 1, serverName: 'node-1' };
    serverDatastampRepo.save.mockResolvedValue(stamp);

    const result = await serverDatastampController.addLog(stamp as never);

    expect(result).toEqual(stamp);
    expect(serverDatastampRepo.save).toHaveBeenCalledWith(stamp);
  });
});
