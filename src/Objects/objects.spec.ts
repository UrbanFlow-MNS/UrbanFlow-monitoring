import { DataLogsEntity } from './Entities/dataLogs.entity';
import { ExternalApiEntity } from './Entities/externalApi.entity';
import { MicroserviceEntity } from './Entities/microservice.entity';
import { ServerDatastampEntity } from './Entities/serverDatastamp.entity';

describe('Entities', () => {
  it('DataLogsEntity can be populated', () => {
    const entity = new DataLogsEntity();
    entity.id = 1;
    entity.isApi = true;
    entity.targetId = 5;
    entity.dateOfData = new Date('2026-01-01T00:00:00.000Z');
    entity.numberOfConnection = 3;
    entity.event = 'call';

    expect(entity).toMatchObject({ id: 1, isApi: true, targetId: 5 });
  });

  it('ExternalApiEntity can be populated', () => {
    const entity = new ExternalApiEntity();
    entity.id = 1;
    entity.name = 'weather';
    entity.url = 'https://api.example.com';
    entity.isActive = true;
    entity.version = '1.0';

    expect(entity).toMatchObject({ name: 'weather', isActive: true });
  });

  it('MicroserviceEntity can be populated', () => {
    const entity = new MicroserviceEntity();
    entity.id = 1;
    entity.name = 'auth';
    entity.isActive = false;
    entity.filePath = '/srv/auth';

    expect(entity).toMatchObject({ name: 'auth', filePath: '/srv/auth' });
  });

  it('ServerDatastampEntity can be populated', () => {
    const entity = new ServerDatastampEntity();
    entity.id = 1;
    entity.serverName = 'node-1';
    entity.cpuPercent = 42;
    entity.gpuPercent = 10;
    entity.ramUsage = 2048;
    entity.internalTemp = 55;

    expect(entity).toMatchObject({ serverName: 'node-1', cpuPercent: 42 });
  });
});
