import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLogsEntity } from './Objects/Entities/dataLogs.entity';
import { ExternalApiEntity } from './Objects/Entities/externalApi.entity';
import { MicroserviceEntity } from './Objects/Entities/microservice.entity';
import { ServerDatastampEntity } from './Objects/Entities/serverDatastamp.entity';
import { DataLogsController } from './Controllers/dataLogs.controller';
import { ExternalApiController } from './Controllers/externalApi.controller';
import { MicroserviceController } from './Controllers/microservice.controller';
import ServerDatastampController from './Controllers/serverDatastamp.controller';
import { PrometheusService } from './Services/prometheus.service';
import { DataLogsService } from './Services/dataLogs.service';
import { ExternalApiService } from './Services/externalApi.service';
import { ServerDatastampService } from './Services/serverDatastamp.service';
import { MicroserviceService } from './Services/microservice.service';
import { PrometheusController } from './Controllers/prometheus.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        DataLogsEntity,
        ExternalApiEntity,
        MicroserviceEntity,
        ServerDatastampEntity,
      ],
      synchronize: process.env.POSTGRES_SYNCHRONISE === 'true',
    }),
    TypeOrmModule.forFeature([
      DataLogsEntity,
      ExternalApiEntity,
      MicroserviceEntity,
      ServerDatastampEntity,
    ]),
  ],
  controllers: [
    DataLogsController,
    ExternalApiController,
    ServerDatastampController,
    MicroserviceController,
    PrometheusController,
  ],
  providers: [
    DataLogsService,
    {
      provide: 'IDataLogsService',
      useClass: DataLogsService,
    },
    ExternalApiService,
    {
      provide: 'IExternalApiService',
      useClass: ExternalApiService,
    },
    ServerDatastampService,
    {
      provide: 'IServerDatastampService',
      useClass: ServerDatastampService,
    },
    MicroserviceService,
    {
      provide: 'IMicroserviceService',
      useClass: MicroserviceService,
    },
    PrometheusService,
    {
      provide: 'IPrometheusService',
      useClass: PrometheusService,
    },
  ],
})
export class AppModule {}
