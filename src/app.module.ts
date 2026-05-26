import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AuditLoggerModule } from './audit-logger/audit-logger.module';
import { AuditQueryModule } from './audit-query/audit-query.module';
import { IntegrityCheckerModule } from './integrity-checker/integrity-checker.module';
import { IncidentsIaModule } from './incidents-ia/incidents-ia.module';
import { LogsDecisionsModule } from './logs-decisions/logs-decisions.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    RabbitMQModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_URL') ?? '',
        exchanges: [
          {
            name: 'audit.events',
            type: 'topic',
          },
        ],
        connectionInitOptions: { wait: true },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuditLoggerModule,
    AuditQueryModule,
    IntegrityCheckerModule,
    IncidentsIaModule,
    LogsDecisionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
