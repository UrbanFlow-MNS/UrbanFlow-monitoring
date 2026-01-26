import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataLogsEntity } from './Objects/Entities/dataLogs.entity';
import { ExternalApiEntity } from './Objects/Entities/externalApi.entity';
import { MicroserviceEntity } from './Objects/Entities/microservice.entity';
import { ServerDatastampEntity } from './Objects/Entities/serverDatastamp.entity';
import { UserAccountEntity } from './Objects/Entities/userAccount.entity';
import { DataLogsController } from './Controllers/dataLogs.controller';
import { ExternalApiController } from './Controllers/externalApi.controller';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [DataLogsEntity, ExternalApiEntity, MicroserviceEntity, ServerDatastampEntity, UserAccountEntity],
      synchronize: Boolean(process.env.POSTGRES_SYNCHRONISE)
    }),
    TypeOrmModule.forFeature([DataLogsEntity, ExternalApiEntity, MicroserviceEntity, ServerDatastampEntity, UserAccountEntity])
  ],  controllers: [AppController, DataLogsController, ExternalApiController],
  providers: [AppService],
})
export class AppModule {}
