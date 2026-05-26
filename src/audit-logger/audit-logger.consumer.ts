import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AuditLoggerService } from './audit-logger.service';
import { AuditEventDto } from './dto/audit-event.dto';

@Injectable()
export class AuditLoggerConsumer {
  private readonly logger = new Logger(AuditLoggerConsumer.name);

  constructor(private readonly auditLoggerService: AuditLoggerService) {}

  @RabbitSubscribe({
    exchange: 'audit.events',
    routingKey: 'audit.action.log',
    queue: 'audit.action.log',
  })
  async handleAuditEvent(message: AuditEventDto): Promise<void> {
    try {
      await this.auditLoggerService.createLog(message);
    } catch (error) {
      this.logger.error('Failed to consume audit event', error instanceof Error ? error.stack : undefined);
    }
  }
}
