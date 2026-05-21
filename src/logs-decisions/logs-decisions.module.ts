import { Module } from '@nestjs/common';
import { LogsDecisionsService } from './logs-decisions.service';
import { LogsDecisionsController } from './logs-decisions.controller';

@Module({
  providers: [LogsDecisionsService],
  controllers: [LogsDecisionsController],
  exports: [LogsDecisionsService],
})
export class LogsDecisionsModule {}
