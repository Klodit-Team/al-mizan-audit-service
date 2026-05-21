import { Module } from '@nestjs/common';
import { IntegrityCheckerService } from './integrity-checker.service';
import { IntegrityCheckerScheduler } from './integrity-checker.scheduler';
import { IntegrityCheckerController } from './integrity-checker.controller';

@Module({
  providers: [IntegrityCheckerService, IntegrityCheckerScheduler],
  controllers: [IntegrityCheckerController],
  exports: [IntegrityCheckerService],
})
export class IntegrityCheckerModule {}
