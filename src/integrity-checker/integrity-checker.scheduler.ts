import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IntegrityCheckerService } from './integrity-checker.service';

@Injectable()
export class IntegrityCheckerScheduler {
  private readonly logger = new Logger(IntegrityCheckerScheduler.name);

  constructor(private readonly integrityCheckerService: IntegrityCheckerService) {}

  @Cron('0 2 * * *')
  async handleCron(): Promise<void> {
    try {
      await this.integrityCheckerService.verifyChain();
    } catch (error) {
      this.logger.error('Integrity check failed', error instanceof Error ? error.stack : undefined);
    }
  }
}
