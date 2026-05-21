import { Module } from '@nestjs/common';
import { AuditLoggerService } from './audit-logger.service';
import { AuditLoggerConsumer } from './audit-logger.consumer';
import { AuditLoggerController } from './audit-logger.controller';

@Module({
  providers: [AuditLoggerService, AuditLoggerConsumer],
  controllers: [AuditLoggerController],
  exports: [AuditLoggerService],
})
export class AuditLoggerModule {}
