import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { IncidentsIaService } from './incidents-ia.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class IncidentsIaConsumer {
  private readonly logger = new Logger(IncidentsIaConsumer.name);

  constructor(private readonly incidentsIaService: IncidentsIaService) {}

  @RabbitSubscribe({
    exchange: 'audit.exchange',
    routingKey: 'incident.detected',
    queue: 'incident.detected',
  })
  async handleIncidentDetected(message: CreateIncidentDto): Promise<void> {
    try {
      await this.incidentsIaService.createIncident(message);
    } catch (error) {
      this.logger.error('Failed to consume incident message', error instanceof Error ? error.stack : undefined);
    }
  }
}
