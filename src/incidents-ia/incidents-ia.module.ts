import { Module } from '@nestjs/common';
import { IncidentsIaService } from './incidents-ia.service';
import { IncidentsIaController } from './incidents-ia.controller';
import { IncidentsIaConsumer } from './incidents-ia.consumer';

@Module({
  providers: [IncidentsIaService, IncidentsIaConsumer],
  controllers: [IncidentsIaController],
  exports: [IncidentsIaService],
})
export class IncidentsIaModule {}
